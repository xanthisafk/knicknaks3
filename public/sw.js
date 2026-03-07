/**
 * Knicknaks Service Worker
 *
 * Strategy:
 * 1. PRE-CACHE: App shell + ALL /_astro/ chunks on install
 * 2. RUNTIME CACHE: StaleWhileRevalidate for anything /_astro/ missed
 * 3. OFFLINE FALLBACK: /offline.html for uncached nav routes
 */

const CACHE_NAME = "knicknaks-v2";

const APP_SHELL = [
    "/",
    "/offline.html",
    "/manifest.json",
];

// ── Install: pre-cache app shell + discover all /_astro/ assets ──────────────
self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);

            // 1. Cache the known app shell
            await cache.addAll(APP_SHELL);

            // 2. Fetch the home page HTML and parse out all /_astro/ asset URLs,
            //    then cache every JS/CSS chunk we find. This ensures tool chunks
            //    are available offline even before the user visits each tool page.
            try {
                const homeRes = await fetch("/");
                const html = await homeRes.text();

                // Grab every /_astro/... href/src reference
                const astroAssets = [
                    ...new Set([
                        ...html.matchAll(/\/_astro\/[^"' >]+/g)
                    ].map(m => m[0]))
                ];

                await Promise.allSettled(
                    astroAssets.map(url => cache.add(url))
                );
            } catch (e) {
                console.warn("[SW] Could not pre-cache /_astro/ assets:", e);
            }
        })()
    );
    self.skipWaiting();
});

// ── Activate: clean old caches ───────────────────────────────────────────────
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// ── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
    const { request } = event;
    if (request.method !== "GET") return;

    const url = new URL(request.url);

    // Navigation: network-first, fall back to cache, then /offline.html
    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    return response;
                })
                .catch(() =>
                    caches.match(request).then(
                        (cached) => cached || caches.match("/offline.html")
                    )
                )
        );
        return;
    }

    // Static assets (/_astro/, fonts, CSS, JS, WASM): cache-first, update in bg
    const isStaticAsset =
        url.pathname.startsWith("/_astro/") ||
        url.pathname.startsWith("/fonts/") ||
        /\.(css|js|wasm|html|svg|png|webp|ico|woff2?)$/.test(url.pathname);

    if (isStaticAsset) {
        event.respondWith(
            caches.open(CACHE_NAME).then(async (cache) => {
                const cached = await cache.match(request);

                // Always revalidate in the background
                const networkPromise = fetch(request).then((response) => {
                    if (response.ok) cache.put(request, response.clone());
                    return response;
                }).catch(() => null);

                // Return cached immediately if we have it; otherwise wait for network
                return cached ?? networkPromise;
            })
        );
        return;
    }
});

// ── Message API: let pages query what's cached ───────────────────────────────
self.addEventListener("message", (event) => {
    if (event.data?.type === "GET_CACHED_URLS") {
        caches.open(CACHE_NAME).then((cache) =>
            cache.keys().then((keys) => {
                const urls = keys.map((r) => new URL(r.url).pathname);
                event.source.postMessage({ type: "CACHED_URLS", urls });
            })
        );
    }
});