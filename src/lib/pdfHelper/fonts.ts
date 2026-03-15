export const loadedFonts = new Set<string>();
export function loadGoogleFont(fontName: string) {
    if (loadedFonts.has(fontName)) return;
    loadedFonts.add(fontName);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
        fontName
    )}:ital,wght@0,400;0,700;1,400;1,700&display=swap`;
    document.head.appendChild(link);
}