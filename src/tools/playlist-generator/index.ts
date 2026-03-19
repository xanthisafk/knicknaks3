import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
    name: "Playlist Generator",
    slug: "playlist-generator",
    description: "Create and export playlists in common formats like M3U, PLS, and XSPF",
    longDescription:
        "Build and export audio or video playlists directly in your browser. Add tracks manually or import an existing playlist, then download it in the format your media player supports.",

    category: "media",
    icon: "🎵",
    keywords: [
        "m3u playlist generator",
        "create m3u file online",
        "playlist maker",
        "pls file generator",
        "xspf playlist creator",
        "m3u8 generator",
        "asx playlist",
        "windows media playlist",
        "online playlist editor",
        "export playlist",
    ],
    tags: ["audio", "video", "media", "playlist", "utility"],

    component: () => import("./PlaylistGeneratorTool"),

    capabilities: {
        supportsFileInput: true,
        supportsOffline: true,
    },

    faq: [
        {
            question: "Which formats can I export?",
            answer:
                "You can export playlists as M3U, M3U8, PLS, XSPF, ASX, and WPL.",
        },
        {
            question: "Can I import an existing playlist?",
            answer:
                "Yes, you can import M3U, M3U8, and PLS files and edit them.",
        },
        {
            question: "Are my files uploaded anywhere?",
            answer:
                "No. Everything runs locally in your browser.",
        },
        {
            question: "What can I use as a track URL?",
            answer:
                "You can use a web URL, a local file path, or a relative path.",
        },
        {
            question: "What is M3U8?",
            answer:
                "M3U8 is a UTF-8 version of M3U, useful for non-English characters.",
        },
        {
            question: "Do playlists contain the actual media files?",
            answer:
                "No. Playlists only reference file locations or URLs.",
        },
        {
            question: "Can I edit track details?",
            answer:
                "Yes. You can add or modify title, artist, and duration.",
        },
        {
            question: "Will this work offline?",
            answer:
                "Yes. Once loaded, the tool works without an internet connection.",
        },
        {
            question: "Which format should I choose?",
            answer:
                "M3U or M3U8 works for most players. Use others if your player requires them.",
        },
        {
            question: "Can I use this for streaming links?",
            answer:
                "Yes. You can include direct stream URLs in your playlist.",
        },
    ],

    howItWorks:
        "Add tracks with a URL or file path, choose a format, preview the result, and download the playlist file.",

    relatedTools: ["iptv-player"],
    schemaType: "WebApplication",
    createdAt: "2026-03-19",
};