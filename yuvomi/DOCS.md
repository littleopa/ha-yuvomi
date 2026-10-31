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

## Showing Yuvomi in the sidebar

The app has a Home Assistant panel: enable **Show in sidebar** on the app
page. Yuvomi cannot run below Home Assistant's ingress sub-path yet, so the
panel embeds Yuvomi's own HTTPS address (`sidebar_url`, or `base_url` when
empty). Requirements:

1. Yuvomi is reachable via HTTPS, e.g. a reverse proxy host
   `https://family.example.com` → `http://<home-assistant-ip>:3000`
   (websockets on), with `base_url` set to it and `behind_https_proxy`
   enabled.
2. Yuvomi allows being framed by Home Assistant. Yuvomi sends
   `X-Frame-Options: SAMEORIGIN` and a CSP with `frame-ancestors 'self'`. In
   the proxy hide both and re-add Yuvomi's own policy with your Home
   Assistant origin added to `frame-ancestors`; for Nginx Proxy Manager in
   **Advanced**:

   ```nginx
   proxy_hide_header X-Frame-Options;
   proxy_hide_header Content-Security-Policy;
   add_header Content-Security-Policy "<Yuvomi's policy> frame-ancestors 'self' https://<your-home-assistant>" always;
   ```

   Copy Yuvomi's policy from `curl -sI http://<home-assistant-ip>:3000/`
   and only change `frame-ancestors`.
3. Log in inside the panel. This works when Yuvomi and Home Assistant share
   the same registrable domain (e.g. `family.example.com` and
   `ha.example.com`), because Yuvomi's session cookie is `SameSite=Lax`.

Opening Home Assistant via a local `http://` address shows the panel only if
that address is also listed in `frame-ancestors`.

## Support

- App issues: <https://github.com/Phillipxh/ha-yuvomi/issues>
- Yuvomi itself: <https://github.com/ulsklyc/yuvomi/issues>
