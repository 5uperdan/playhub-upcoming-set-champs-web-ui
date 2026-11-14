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
~6–12 requests per page load and ~3.2/min per polling viewer. Large events
cost more on load — registrations are paged 100 at a time, so a 1,600-player
event is ~17 requests before any match data.

Allowed paths (`ALLOWED_PATH`): `/events/{id}…`, `/tournament-rounds/{id}…`,
and `/deckbuilder/decks/{uuid}/` — one published decklist, fetched only when a
viewer opens it from the standings (one request per deck opened). Until the
dashboard copy is redeployed with the deck path, the watch page's decklist
modal shows "Couldn't load this decklist" with `API error 404`.
