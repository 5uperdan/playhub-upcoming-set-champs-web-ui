// Cloudflare Worker: CORS proxy for the PlayHub API, used by docs/watch.html.
// Forwards GET requests for an allowlist of API paths and re-serves the
// response with permissive CORS headers. The PlayHub API requires the
// x-game-slug / Origin / Referer headers, which browsers can't set —
// injecting them here is the whole reason this worker exists.
//
// DEPLOYMENT IS CLICKOPS: this file is the source of truth, but it runs from
// a copy pasted into the Cloudflare dashboard editor (see README.md). If you
// edit this file, the change does nothing until it's re-pasted and deployed.

const API_BASE = 'https://api.cloudflare.ravensburgerplay.com/hydraproxy/api/v2';
// Paths the watch page actually uses: /events/{id}/, /events/{id}/registrations/,
// /tournament-rounds/{id}/matches/paginated/. Numeric id right after the prefix
// keeps this from being an open proxy.
const ALLOWED_PATH = /^\/(events|tournament-rounds)\/\d+/;

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': '*',
};

export default {
    async fetch(request) {
        const url = new URL(request.url);

        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: CORS_HEADERS });
        }
        if (request.method !== 'GET' || !ALLOWED_PATH.test(url.pathname)) {
            return new Response('Not found', { status: 404, headers: CORS_HEADERS });
        }

        const upstream = await fetch(API_BASE + url.pathname + url.search, {
            headers: {
                'x-game-slug': 'disney-lorcana',
                'Origin': 'https://tcg.ravensburgerplay.com',
                'Referer': 'https://tcg.ravensburgerplay.com/',
            },
        });

        // Rebuild the response so upstream status passes through verbatim
        // (watch.html relies on 404 meaning "round not started") while we
        // control the headers.
        const resp = new Response(upstream.body, {
            status: upstream.status,
            headers: {
                'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
                ...CORS_HEADERS,
            },
        });
        return resp;
    },
};
