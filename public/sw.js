/**
 * Knicknaks Service Worker
 *
 * Strategy:
 * 1. PRE-CACHE: App shell (HTML, CSS, fonts, core JS) on install
 * 2. RUNTIME CACHE: Tool chunks cached as they're visited (StaleWhileRevalidate)
 * 3. OFFLINE FALLBACK: /offline.html for uncached routes
 */

const CACHE_NAME = "knicknaks-v1";
const APP_SHELL = [
    "/",
    "/offline.html",
    "/manifest.json",
];

// Install: pre-cache app shell
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
    );
    self.skipWaiting();
});

// Activate: clean old caches
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

// Fetch: Network-first for navigation, StaleWhileRevalidate for assets
self.addEventListener("fetch", (event) => {
    const { request } = event;

    // Skip non-GET requests
    if (request.method !== "GET") return;

    // Navigation requests (HTML pages)
    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Cache the page for offline use
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    return response;
                })
                .catch(() => {
                    // Try cache, then offline fallback
                    return caches.match(request).then(
                        (cached) => cached || caches.match("/offline.html")
                    );
                })
        );
        return;
    }

    // Static assets: StaleWhileRevalidate
    if (
        request.url.includes("/_astro/") ||
        request.url.includes("/fonts/") ||
        request.url.endsWith(".css") ||
        request.url.endsWith(".js") ||
        request.url.endsWith(".wasm") ||
        request.url.endsWith(".html")
    ) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) =>
                cache.match(request).then((cached) => {
                    const network = fetch(request).then((response) => {
                        cache.put(request, response.clone());
                        return response;
                    });
                    return cached || network;
                })
            )
        );
        return;
    }
});
