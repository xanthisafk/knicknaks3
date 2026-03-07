import { useEffect, useState } from "react";

/**
 * Returns a Set of pathnames currently in the SW cache.
 * Components can use this to check if a tool page is offline-ready.
 *
 * Usage:
 *   const cached = useOfflineReady();
 *   const isReady = cached.has("/tools/age-calculator/");
 */
export function useOfflineReady() {
  const [cachedPaths, setCachedPaths] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const sw = navigator.serviceWorker.controller;
    if (!sw) return;

    // Listen for the response
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "CACHED_URLS") {
        setCachedPaths(new Set(event.data.urls));
      }
    };

    navigator.serviceWorker.addEventListener("message", handler);
    sw.postMessage({ type: "GET_CACHED_URLS" });

    return () => navigator.serviceWorker.removeEventListener("message", handler);
  }, []);

  return cachedPaths;
}