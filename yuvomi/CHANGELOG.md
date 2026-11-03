# Changelog

## 2.84.0-2

- Sign-in with Home Assistant follows the second upstream review: changing or removing a member's
  Home Assistant ID ends their sessions, a failed token revoke is logged, and bindings use the fixed
  provider key `homeassistant` instead of the Home Assistant URL. Existing bindings are moved over
  at startup.

## 2.84.0-1

- Yuvomi 2.84.0 ([release notes](https://github.com/ulsklyc/yuvomi/releases/tag/v2.84.0)).
- Sign-in with Home Assistant carried over to 2.84.0 unchanged.

## 2.83.0-9

- Signing in with Home Assistant from the sidebar no longer opens a separate window. This part
  was removed from the upstream pull request, so the app follows it. Sign in once by opening
  Yuvomi directly in the browser; the sidebar then uses the same session.

## 2.83.0-8

- On a new installation, signing in with Home Assistant before setup no longer creates an
  account. It leads to the setup page instead, so the first account is always the administrator.

## 2.83.0-7

- Sign-in with Home Assistant updated to the reviewed version of the upstream pull request:
  - Administrators can bind a member to a Home Assistant user ID in the member dialog
    (Settings > Family), also for accounts without a password.
  - New accounts get the Home Assistant display name as username instead of the user ID.
  - New accounts always start as members, also for Home Assistant administrators.

## 2.83.0-6

- Repository moved to littleopa/ha-yuvomi. Please update the repository URL in Home Assistant if you added it under an older name.

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
