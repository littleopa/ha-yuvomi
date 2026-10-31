# Changelog

## 2.83.0-2

- Sidebar support: the app now has a Home Assistant panel ("Show in sidebar")
  that embeds Yuvomi via its HTTPS address (`base_url` or `sidebar_url`).

## 2.83.0-1

- Native Docker health check instead of the obsolete watchdog option.

## 2.83.0

- First release, based on Yuvomi 2.83.0.
- Options for public URL, HTTPS reverse proxy, weather, calendar sync and
  backups, plus free-form environment variables.
- Database, secrets, documents, modules and nightly backups stored in `/data`
  (included in Home Assistant backups, cold backup for consistency).
