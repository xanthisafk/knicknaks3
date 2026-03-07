import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "IPTV Player",
  slug: "iptv-player",
  description: "Play IPTV streams directly in your browser",
  longDescription:
    "Watch IPTV streams directly from your browser using your own M3U or M3U8 playlists. This lightweight web IPTV player supports HLS streams and allows you to load local or remote playlists without installing any software. " +
    "All processing happens entirely within your browser, ensuring maximum privacy and zero server uploads. Ideal for testing IPTV playlists, previewing channels, or watching personal IPTV streams quickly and securely.",

  category: "media",
  status: "new",
  icon: "📺",

  keywords: [
    "iptv player online",
    "m3u player online",
    "m3u8 player browser",
    "watch iptv in browser",
    "play m3u playlist online",
    "hls stream player",
    "online iptv viewer",
    "m3u8 streaming player",
    "iptv playlist player",
    "browser video streaming player"
  ],

  tags: ["media", "video", "streaming"],

  component: () => import("./IptvPlayerTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "What playlist formats are supported?",
      answer:
        "This IPTV player supports standard M3U and M3U8 playlist formats commonly used for IPTV streaming and HLS video feeds."
    },
    {
      question: "Are IPTV playlists uploaded to a server?",
      answer:
        "No. All playlist parsing and video playback occur locally in your browser. Your playlist files and stream links are never uploaded or stored."
    },
    {
      question: "Can I load remote IPTV playlists?",
      answer:
        "Yes. If the playlist URL allows cross-origin access (CORS), you can load remote M3U or M3U8 playlists directly."
    }
  ],

  howItWorks:
    "Upload an M3U or M3U8 playlist file or paste a playlist URL. The player will parse the channel list and allow you to select and play streams directly within the browser.",

  relatedTools: ["video-converter", "audio-converter", "media-metadata"],

  schemaType: "WebApplication",
  lastUpdated: "2026-03-05",
};