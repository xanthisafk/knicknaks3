/**
 * 🪀 Knicknaks Service Worker
 */

const CACHE_NAME = "knicknaks-v3";

const APP_SHELL = ["/", "/offline.html", "/manifest.json"];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Extract every same-origin URL referenced in an HTML string */
function extractUrlsFromHtml(html, baseOrigin) {
    const patterns = [
        // src / href attributes
        /(?:src|href)=["']([^"']+)["']/g,
        // Astro / Vite module preload chunks
        /\/_astro\/[^"' >)]+/g,
        // Any absolute path starting with /
        /["'](\/[^"' >)]+\.[a-z0-9]+)["']/g,
    ];

    const urls = new Set();

    for (const pattern of patterns) {
        for (const match of html.matchAll(pattern)) {
            const raw = match[1] ?? match[0];
            // Skip external URLs, data URIs, anchors
            if (!raw || raw.startsWith("http") || raw.startsWith("data:") || raw.startsWith("#")) continue;
            try {
                const url = new URL(raw, baseOrigin);
                if (url.origin === baseOrigin) urls.add(url.pathname + url.search);
            } catch (_) { /* malformed - skip */ }
        }
    }

    return [...urls];
}

/** Fetch a URL and store it in the given cache. Silently skips on failure. */
async function fetchAndCache(cache, url) {
    try {
        const response = await fetch(url, { credentials: "same-origin" });
        // Accept any 2xx OR opaque (cross-origin) response
        if (response.ok || response.type === "opaque") {
            await cache.put(url, response);
            return true;
        }
    } catch (_) { /* network error - ignore */ }
    return false;
}

/**
 * Crawl the entire static site by:
 *  1. Fetching all HTML pages discovered from the sitemap (if present).
 *  2. Falling back to a breadth-first crawl starting from "/".
 *  3. For every HTML page found, extracting & caching all linked assets.
 *
 * Sends progress messages to all connected clients.
 */
async function cacheEntireSite() {
    const cache = await caches.open(CACHE_NAME);
    const origin = self.location.origin;
    const visited = new Set();
    const queue = ["/"];

    // ── Try sitemap first ────────────────────────────────────────────────────
    try {
        const sitemapRes = await fetch("/sitemap.xml");
        if (sitemapRes.ok) {
            const xml = await sitemapRes.text();
            for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
                try {
                    const u = new URL(match[1]);
                    if (u.origin === origin) queue.push(u.pathname);
                } catch (_) { }
            }
            await cache.put("/sitemap.xml", sitemapRes.clone());
        }
    } catch (_) { /* no sitemap - fine */ }

    // ── Breadth-first HTML crawl ─────────────────────────────────────────────
    const allAssets = new Set(APP_SHELL);

    while (queue.length) {
        const path = queue.shift();
        if (visited.has(path)) continue;
        visited.add(path);

        try {
            const res = await fetch(path, { credentials: "same-origin" });
            if (!res.ok) continue;

            const html = await res.text();
            // Re-construct response to cache (already consumed the body)
            await cache.put(path, new Response(html, {
                status: res.status,
                headers: res.headers,
            }));

            const linked = extractUrlsFromHtml(html, origin);

            for (const url of linked) {
                allAssets.add(url);
                // Queue HTML pages we haven't seen yet
                if (!visited.has(url) && !url.match(/\.[a-z0-9]+$/i)) {
                    queue.push(url);
                }
                // Also queue obvious .html files
                if (!visited.has(url) && url.endsWith(".html")) {
                    queue.push(url);
                }
            }
        } catch (_) { /* fetch failed - skip page */ }
    }

    // ── Cache all discovered assets in parallel (batched) ───────────────────
    const assets = [...allAssets].filter(u => !visited.has(u));
    const BATCH = 20;
    let cached = visited.size; // pages already cached
    const total = visited.size + assets.length;

    broadcastProgress(cached, total, "Caching pages...");

    for (let i = 0; i < assets.length; i += BATCH) {
        const batch = assets.slice(i, i + BATCH);
        await Promise.allSettled(batch.map(url => fetchAndCache(cache, url)));
        cached += batch.length;
        broadcastProgress(cached, total, "Caching assets...");
    }

    broadcastProgress(total, total, "Ready for offline use!");
}

function broadcastProgress(done, total, label) {
    self.clients.matchAll({ includeUncontrolled: true }).then(clients => {
        clients.forEach(c => c.postMessage({
            type: "CACHE_PROGRESS",
            done,
            total,
            label,
            percent: total ? Math.round((done / total) * 100) : 100,
        }));
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// Install — minimal app shell only; full cache triggered on demand
// ─────────────────────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
    );
    self.skipWaiting();
});

// ─────────────────────────────────────────────────────────────────────────────
// Activate — delete old caches
// ─────────────────────────────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

// ─────────────────────────────────────────────────────────────────────────────
// Fetch
// ─────────────────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
    const { request } = event;
    if (request.method !== "GET") return;

    const url = new URL(request.url);

    // ── Navigation (HTML pages) ──────────────────────────────────────────────
    // Network-first; cache the page + all its /_astro/ chunks for offline use.
    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then(async (response) => {
                    const cache = await caches.open(CACHE_NAME);

                    // Store the page itself
                    cache.put(request, response.clone());

                    // Parse & cache any /_astro/ chunks referenced on this page.
                    // Wrapped in event.waitUntil so the SW is kept alive until
                    // every chunk fetch settles — not just until we return the response.
                    const chunkWork = response.clone().text().then(html => {
                        const chunks = extractUrlsFromHtml(html, url.origin)
                            .filter(u => u.startsWith("/_astro/") || /\.(js|css|wasm)/.test(u));
                        return Promise.allSettled(chunks.map(chunk => fetchAndCache(cache, chunk)));
                    }).catch(() => { });

                    event.waitUntil(chunkWork);

                    return response;
                })
                .catch(() =>
                    caches.match(request).then(
                        cached => cached ?? caches.match("/offline.html")
                    )
                )
        );
        return;
    }

    // ── Static assets ────────────────────────────────────────────────────────
    // Cache-first, update in background (stale-while-revalidate).
    const isStaticAsset =
        url.pathname.startsWith("/_astro/") ||
        url.pathname.startsWith("/fonts/") ||
        url.pathname.startsWith("/images/") ||
        url.pathname.startsWith("/icons/") ||
        /\.(css|js|mjs|wasm|svg|png|jpg|jpeg|webp|avif|ico|woff2?)(\?.*)?$/.test(url.pathname);

    if (isStaticAsset) {
        event.respondWith(
            caches.open(CACHE_NAME).then(async (cache) => {
                const cached = await cache.match(request);

                // Revalidation promise — NEVER resolves to null.
                // If fetch fails and there is no cache, we return a real 503
                // so the browser gets a hard error instead of a silent null crash.
                const networkPromise = fetch(request)
                    .then(res => {
                        if (res.ok || res.type === "opaque") cache.put(request, res.clone());
                        return res;
                    })
                    .catch(() =>
                        // Propagate the original cached copy one more time if
                        // the background refresh fails while we were waiting.
                        cache.match(request).then(
                            fallback => fallback ?? new Response("Asset unavailable offline", {
                                status: 503,
                                headers: { "Content-Type": "text/plain" },
                            })
                        )
                    );

                // Serve cache immediately; fall through to network if cold.
                // networkPromise is now guaranteed to resolve to a Response.
                return cached ?? networkPromise;
            })
        );
        return;
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// Message API
// ─────────────────────────────────────────────────────────────────────────────
self.addEventListener("message", (event) => {
    const { type } = event.data ?? {};

    // Triggered when user accepts the install prompt — cache everything
    if (type === "CACHE_ALL") {
        event.waitUntil(cacheEntireSite());
        return;
    }

    // Let pages query what's already cached
    if (type === "GET_CACHED_URLS") {
        caches.open(CACHE_NAME).then(cache =>
            cache.keys().then(keys => {
                const urls = keys.map(r => new URL(r.url).pathname);
                event.source.postMessage({ type: "CACHED_URLS", urls });
            })
        );
        return;
    }

    // Force-refresh the full cache (e.g. after a new deploy)
    if (type === "REFRESH_CACHE") {
        event.waitUntil(
            (async () => {
                // 1. Broadcast that a refresh has started so the UI can show a spinner
                broadcastProgress(0, 1, "Clearing old cache...");

                // 2. Delete the old cache fully before doing anything else,
                //    so in-flight fetch handlers don't race against a half-deleted store
                await caches.delete(CACHE_NAME);

                // 3. Re-seed the app shell immediately so the SW is never left
                //    with an empty cache between deletion and full crawl
                const fresh = await caches.open(CACHE_NAME);
                await fresh.addAll(APP_SHELL);

                // 4. Now crawl + cache the whole site (broadcasts its own progress)
                await cacheEntireSite();
            })()
        );
        return;
    }
});