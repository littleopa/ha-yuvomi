ARG BUILD_FROM=ghcr.io/ulsklyc/yuvomi:2.83.0
FROM ${BUILD_FROM}

COPY run.sh /run.sh
COPY options.mjs /options.mjs
COPY ingress.mjs /ingress.mjs
RUN chmod +x /run.sh

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["/run.sh"]
CMD ["node", "server/index.js"]

LABEL \
  io.hass.type="addon" \
  io.hass.arch="amd64|aarch64" \
  org.opencontainers.image.source="https://github.com/Phillipxh/ha-yuvomi" \
  org.opencontainers.image.licenses="MIT"
