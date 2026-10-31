ARG BUILD_FROM=ghcr.io/ulsklyc/yuvomi:2.83.0
FROM ${BUILD_FROM}

COPY run.sh /run.sh
COPY options.mjs /options.mjs
RUN chmod +x /run.sh

ENTRYPOINT ["/run.sh"]
CMD ["node", "server/index.js"]

LABEL \
  io.hass.type="addon" \
  io.hass.arch="amd64|aarch64" \
  org.opencontainers.image.source="https://github.com/Phillipxh/ha-yuvomi" \
  org.opencontainers.image.licenses="MIT"
