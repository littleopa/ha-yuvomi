# Yuvomi

[Yuvomi](https://github.com/ulsklyc/yuvomi) is a self-hosted family planner:
tasks, calendar, shopping lists, meals, budget, health and more in one PWA.
This app runs the official Yuvomi image inside Home Assistant.

## Installation

1. Add this repository in **Settings → Apps → App store → ⋮ → Repositories**:
   `https://github.com/Phillipxh/ha-yuvomi`
2. Install **Yuvomi** and start it.
3. Click **Open web UI** (or browse to `http://<home-assistant>:3000`) and
   create the first account – it becomes the administrator.

## Configuration

| Option | Description |
| --- | --- |
| `base_url` | Public address of Yuvomi, e.g. `https://family.example.com`. Used for calendar feeds, invitation links and OAuth callbacks. |
| `behind_https_proxy` | Enable when Yuvomi is reached through an HTTPS reverse proxy. Sets secure cookies and trusts forwarded headers. Keep it **off** for plain `http://…:3000` access, otherwise login cookies are dropped. |
| `weather_city`, `weather_lat`, `weather_lon` | Location for the weather widget. |
| `sync_interval_minutes` | Sync interval for external calendars. |
| `backup_keep` | Number of nightly Yuvomi backups kept in `/data/backups`. |
| `log_level` | `debug`, `info`, `warn` or `error`. |
| `env_vars` | Any other Yuvomi variable as `KEY=VALUE` (OIDC, WebDAV backups, Immich screensaver, Google/Microsoft calendar, …). See Yuvomi's [`.env.example`](https://github.com/ulsklyc/yuvomi/blob/main/.env.example). |

### Example: behind Nginx Proxy Manager

```yaml
base_url: https://family.example.com
behind_https_proxy: true
```

Point the proxy host at `http://<home-assistant-ip>:3000` and enable
websocket support.

## Data and backups

Everything lives in the app's `/data` folder and is therefore part of every
Home Assistant backup:

- `yuvomi.db` – the encrypted (SQLCipher) database
- `secrets.json` – `SESSION_SECRET` and `DB_ENCRYPTION_KEY`, generated on the
  first start. **Without this key the database cannot be opened.** Keep your
  Home Assistant backups.
- `backups/` – Yuvomi's own nightly backups
- `documents/` – uploaded documents
- `modules/` – third-party drop-in modules

The app uses *cold* backups: Home Assistant stops Yuvomi for a few seconds
while the backup is written, so the database is always consistent.

## Moving an existing Yuvomi installation into the app

1. Stop your existing Yuvomi container.
2. Install and start this app once, then stop it.
3. Replace `yuvomi.db` in the app's data folder with your existing database
   (on Home Assistant OS the folder is
   `/mnt/data/supervisor/addons/data/<repository-id>_yuvomi`, reachable with
   root access to the host).
4. Put your old `SESSION_SECRET` and `DB_ENCRYPTION_KEY` into `secrets.json`
   in the same folder.
5. Start the app and check the log for `Connected: /data/yuvomi.db`.

## Sidebar

Yuvomi does not support being served below a sub-path yet, so it cannot use
Home Assistant ingress. It opens on its own port instead. To show it in a
dashboard, use a **Webpage** card pointing at your HTTPS `base_url`.

## Support

- App issues: <https://github.com/Phillipxh/ha-yuvomi/issues>
- Yuvomi itself: <https://github.com/ulsklyc/yuvomi/issues>
