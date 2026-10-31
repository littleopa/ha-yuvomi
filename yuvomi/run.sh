#!/bin/sh
# Home Assistant app entrypoint for Yuvomi.
set -e

ENV_FILE="$(mktemp)"
node /options.mjs > "$ENV_FILE"
. "$ENV_FILE"
rm -f "$ENV_FILE"

echo "[ha-yuvomi] Starting Yuvomi on port ${PORT} (data in /data)"

# Hand over to the upstream entrypoint: it fixes volume ownership and drops
# privileges to the unprivileged node user.
exec /entrypoint.sh "$@"
