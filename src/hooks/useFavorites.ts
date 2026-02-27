import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "knicknaks-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {}
  }, []);

  const saveFavorites = useCallback((updated: string[]) => {
    setFavorites(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const toggleFavorite = useCallback(
    (slug: string) => {
      const updated = favorites.includes(slug)
        ? favorites.filter((s) => s !== slug)
        : [...favorites, slug];
      saveFavorites(updated);
    },
    [favorites, saveFavorites]
  );

  const isFavorite = useCallback(
    (slug: string) => favorites.includes(slug),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
}
