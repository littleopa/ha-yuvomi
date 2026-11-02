ARG BUILD_FROM=ghcr.io/ulsklyc/yuvomi:2.84.0
FROM ${BUILD_FROM}

# Anmeldung mit Home Assistant, bis Yuvomi sie selbst mitbringt
# (https://github.com/ulsklyc/yuvomi - Pull Request "feat(auth): sign in with Home Assistant").
COPY patches/ /tmp/patches/
RUN apt-get update \
  && apt-get install -y --no-install-recommends patch \
  && for p in /tmp/patches/*.patch; do patch -p1 -d /app --forward --batch < "$p"; done \
  && apt-get purge -y patch && apt-get autoremove -y && rm -rf /var/lib/apt/lists/* /tmp/patches

COPY run.sh /run.sh
COPY options.mjs /options.mjs
COPY ingress.mjs /ingress.mjs
COPY link-accounts.mjs /link-accounts.mjs
RUN chmod +x /run.sh

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["/run.sh"]
CMD ["node", "server/index.js"]

LABEL \
  io.hass.type="addon" \
  io.hass.arch="amd64|aarch64" \
  org.opencontainers.image.source="https://github.com/littleopa/ha-yuvomi" \
  org.opencontainers.image.licenses="MIT"
