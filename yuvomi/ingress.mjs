// Tiny Home Assistant ingress page. Yuvomi itself cannot run below the
// ingress sub-path, so the sidebar panel embeds Yuvomi's own HTTPS address
// in a full-size frame instead.
import { createServer } from 'node:http';

const PORT = 8099;
const SUPERVISOR = '172.30.32.2';
const target = (process.env.YUVOMI_SIDEBAR_URL || process.env.BASE_URL || '').trim();

const esc = (s) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const page = target
  ? `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Yuvomi</title>
<style>html,body{margin:0;height:100%;background:#111}iframe{border:0;width:100%;height:100%;display:block}</style>
</head><body>
<iframe src="${esc(target)}" allow="clipboard-write; fullscreen; geolocation; camera; microphone" referrerpolicy="strict-origin-when-cross-origin"></iframe>
</body></html>`
  : `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Yuvomi</title>
<style>body{font-family:system-ui,sans-serif;max-width:40rem;margin:3rem auto;padding:0 1rem;line-height:1.5;color:#e1e1e1;background:#111}a{color:#8ab4f8}code{background:#222;padding:.1em .3em;border-radius:4px}</style>
</head><body>
<h1>Yuvomi</h1>
<p>To show Yuvomi here, set the app option <code>base_url</code> to the
HTTPS address of Yuvomi (for example via a reverse proxy) and restart the app.
See the <b>Documentation</b> tab.</p>
<p>Until then open Yuvomi directly on port 3000 of your Home Assistant host.</p>
</body></html>`;

createServer((req, res) => {
  const ip = (req.socket.remoteAddress || '').replace(/^::ffff:/, '');
  if (ip !== SUPERVISOR && ip !== '127.0.0.1') {
    res.writeHead(403).end();
    return;
  }
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(page);
}).listen(PORT, () => console.log(`[ha-yuvomi] Sidebar page on :${PORT} → ${target || '(no base_url set)'}`));
