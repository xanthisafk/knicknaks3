import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "knicknaks-recent-tools";
const MAX_RECENT = 10;

export function useRecentTools() {
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecentSlugs(JSON.parse(stored));
    } catch {}
  }, []);

  const addRecent = useCallback((slug: string) => {
    setRecentSlugs((prev) => {
      const updated = [slug, ...prev.filter((s) => s !== slug)]
        .slice(0, MAX_RECENT);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []); // ✅ EMPTY dependency array

  return { recentSlugs, addRecent };
}
