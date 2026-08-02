# playhub-cors-proxy

Cloudflare Worker that proxies the PlayHub API for `docs/watch.html`,
adding the CORS headers the browser needs (the API sends none) and the
`x-game-slug`/`Origin`/`Referer` headers the API requires.

**Deployed via the Cloudflare dashboard (clickops), not wrangler.**
`worker.js` in this directory is the source of truth; the running copy
lives in the dashboard editor. To update it:

1. Log in at https://dash.cloudflare.com
2. Compute (Workers) → open the `playhub-cors-proxy` worker → Edit code
3. Replace the editor contents with `worker.js` from this directory
4. Click Deploy

The deployed URL is hardcoded as `API_PROXY_BASE` in `docs/watch.html` —
update it there if the worker is renamed or moved to another account.

Free-plan limits: 100k requests/day, ~1k/min burst. The watch page costs
~6–12 requests per page load and ~3.2/min per polling viewer.
