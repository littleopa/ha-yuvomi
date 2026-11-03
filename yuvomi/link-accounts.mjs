// Links existing Yuvomi accounts to Home Assistant users before Yuvomi starts
// (app option `link_accounts`, entries "yuvomi_username=home_assistant_user_id").
//
// This is the same binding Yuvomi creates under Settings > Account > link SSO
// (users.oidc_sub / oidc_provider), set by the Home Assistant administrator so
// nobody needs a Yuvomi password first. Existing bindings are never changed:
// an account linked to a different Home Assistant user stays as it is, and a
// Home Assistant user already bound to another account is skipped.
import { readFileSync, existsSync } from 'node:fs';

const opts = JSON.parse(readFileSync('/data/options.json', 'utf8'));
const entries = (opts.link_accounts || []).filter((e) => typeof e === 'string' && e.includes('='));
const haUrl = (process.env.HOMEASSISTANT_URL || '').replace(/\/+$/, '');
// Fixed provider key since the second upstream review (#2428): bindings no
// longer depend on the Home Assistant address.
const provider = 'homeassistant';

if (!haUrl) {
  if (entries.length) console.error('[ha-yuvomi] link_accounts ignored: Home Assistant sign-in is not configured.');
  process.exit(0);
}
if (!existsSync(process.env.DB_PATH)) {
  if (entries.length) console.error('[ha-yuvomi] link_accounts ignored: no database yet (start Yuvomi once first).');
  process.exit(0);
}

const db = await import('/app/server/db.js');
db.init({ plaintextBackup: false });
const database = db.get();

// Bindings written before 2.84.0-2 carry the Home Assistant URL as provider.
const moved = database.prepare(
  "UPDATE users SET oidc_provider = ? WHERE oidc_sub IS NOT NULL AND rtrim(oidc_provider, '/') = ?",
).run(provider, haUrl).changes;
if (moved) console.log(`[ha-yuvomi] ${moved} Home Assistant binding(s) moved to the provider key "${provider}"`);

for (const entry of entries) {
  const i = entry.indexOf('=');
  const username = entry.slice(0, i).trim();
  const haUserId = entry.slice(i + 1).trim();
  if (!username || !/^[0-9a-f]{32}$/.test(haUserId)) {
    console.error(`[ha-yuvomi] link_accounts: skipping "${entry}" (expected username=<32-hex Home Assistant user id>)`);
    continue;
  }
  const user = database.prepare('SELECT id, oidc_sub FROM users WHERE username = ? COLLATE NOCASE').get(username);
  if (!user) {
    console.error(`[ha-yuvomi] link_accounts: no Yuvomi account "${username}"`);
    continue;
  }
  if (user.oidc_sub === haUserId) continue;
  if (user.oidc_sub) {
    console.error(`[ha-yuvomi] link_accounts: "${username}" is already linked to another SSO identity, left unchanged`);
    continue;
  }
  const taken = database.prepare('SELECT username FROM users WHERE oidc_sub = ?').get(haUserId);
  if (taken) {
    console.error(`[ha-yuvomi] link_accounts: Home Assistant user ${haUserId} is already linked to "${taken.username}", skipped`);
    continue;
  }
  database.prepare('UPDATE users SET oidc_sub = ?, oidc_provider = ? WHERE id = ?').run(haUserId, provider, user.id);
  console.log(`[ha-yuvomi] link_accounts: "${username}" is now linked to Home Assistant user ${haUserId}`);
}
process.exit(0);
