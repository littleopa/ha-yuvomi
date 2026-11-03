#!/bin/sh
# Home Assistant app entrypoint for Yuvomi.
set -e

ENV_FILE="$(mktemp)"
node /options.mjs > "$ENV_FILE"
. "$ENV_FILE"
rm -f "$ENV_FILE"

# Link Yuvomi accounts to Home Assistant users (option link_accounts).
chown -R node:node /data
HOME=/home/node setpriv --reuid=node --regid=node --init-groups -- node /link-accounts.mjs || echo "[ha-yuvomi] link_accounts failed, starting anyway"

# Sidebar (ingress) page, runs unprivileged next to Yuvomi.
HOME=/home/node setpriv --reuid=node --regid=node --init-groups -- node /ingress.mjs &

echo "[ha-yuvomi] Starting Yuvomi on port ${PORT} (data in /data)"

# Hand over to the upstream entrypoint: it fixes volume ownership and drops
# privileges to the unprivileged node user.
exec /entrypoint.sh "$@"
