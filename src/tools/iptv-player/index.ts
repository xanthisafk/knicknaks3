import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "IPTV Player",
  slug: "iptv-player",
  description: "Load your own M3U/M3U8 playlists to watch channels directly in your browser. All processing is 100% client-side.",
  category: "media",
  icon: "📺",
  keywords: ["iptv", "m3u", "m3u8", "player", "stream", "hls", "video", "playlist", "tv", "channels"],

  component: () => import("./IptvPlayerTool"),

  capabilities: {
    supportsOffline: true,
  },

  lastUpdated: "2026-03-05",
};
