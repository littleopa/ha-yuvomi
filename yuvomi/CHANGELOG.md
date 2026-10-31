# Changelog

## 2.83.0-5

- New option `link_accounts`: link existing Yuvomi accounts to Home Assistant
  users without signing in with a Yuvomi password first.

## 2.83.0-4

- Config cleanup (linter): default ingress port, no separate web UI link next to the panel.

## 2.83.0-3

- Sign in with Home Assistant (options `homeassistant_login`, `homeassistant_url`,
  `allow_signup`, `password_login`), shipped as a patch until Yuvomi includes it.
- SSO from the sidebar opens in a separate window and the panel reloads by itself.

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
