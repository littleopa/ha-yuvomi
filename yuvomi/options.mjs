// Translates the Home Assistant app options (/data/options.json) into the
// environment variables Yuvomi expects and prints them as shell `export` lines.
// Secrets are generated once and persisted in /data/secrets.json so they are
// part of every Home Assistant backup.
import { readFileSync, writeFileSync, existsSync, mkdirSync, chmodSync } from 'node:fs';
import { randomBytes } from 'node:crypto';

const DATA = '/data';
const opts = existsSync(`${DATA}/options.json`)
  ? JSON.parse(readFileSync(`${DATA}/options.json`, 'utf8'))
  : {};

const secretsFile = `${DATA}/secrets.json`;
let secrets = {};
if (existsSync(secretsFile)) {
  secrets = JSON.parse(readFileSync(secretsFile, 'utf8'));
}
let changed = false;
for (const key of ['SESSION_SECRET', 'DB_ENCRYPTION_KEY']) {
  if (!secrets[key]) {
    secrets[key] = randomBytes(48).toString('base64url');
    changed = true;
  }
}
if (changed) {
  writeFileSync(secretsFile, JSON.stringify(secrets, null, 2) + '\n', { mode: 0o600 });
  console.error('[ha-yuvomi] Generated new secrets in /data/secrets.json');
}
chmodSync(secretsFile, 0o600);

for (const dir of ['backups', 'documents', 'modules']) {
  mkdirSync(`${DATA}/${dir}`, { recursive: true });
}

const env = {
  NODE_ENV: 'production',
  PORT: '3000',
  DB_PATH: `${DATA}/yuvomi.db`,
  BACKUP_DIR: `${DATA}/backups`,
  DOCUMENT_STORAGE_LOCAL_PATH: `${DATA}/documents`,
  MODULES_DIR: `${DATA}/modules`,
  SESSION_SECRET: secrets.SESSION_SECRET,
  DB_ENCRYPTION_KEY: secrets.DB_ENCRYPTION_KEY,
  LOG_LEVEL: opts.log_level || 'info',
  SYNC_INTERVAL_MINUTES: String(opts.sync_interval_minutes ?? 15),
  BACKUP_KEEP: String(opts.backup_keep ?? 7),
};

if (opts.sidebar_url) env.YUVOMI_SIDEBAR_URL = opts.sidebar_url;
if (opts.base_url) env.BASE_URL = opts.base_url.replace(/\/+$/, '');
if (opts.behind_https_proxy) {
  env.SESSION_SECURE = 'true';
  env.TRUST_PROXY = '1';
}
if (opts.weather_city) env.WEATHER_CITY = opts.weather_city;
if (opts.weather_lat) env.WEATHER_LAT = String(opts.weather_lat);
if (opts.weather_lon) env.WEATHER_LON = String(opts.weather_lon);

// Free-form KEY=VALUE overrides for every other Yuvomi setting
// (OIDC, SMTP, WebDAV backups, Immich, ...). They win over the defaults above.
for (const line of opts.env_vars || []) {
  const i = line.indexOf('=');
  if (i > 0) env[line.slice(0, i)] = line.slice(i + 1);
}

const quote = (v) => `'${String(v).replace(/'/g, `'\\''`)}'`;
for (const [k, v] of Object.entries(env)) {
  if (!/^[A-Z][A-Z0-9_]*$/.test(k)) continue;
  process.stdout.write(`export ${k}=${quote(v)}\n`);
}
