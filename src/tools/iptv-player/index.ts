import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "IPTV Player",
  slug: "iptv-player",
  description: "Play M3U and M3U8 IPTV streams instantly in your browser",
  longDescription:
    "Play IPTV fast with a clean, reliable browser player. Load M3U or M3U8 playlists, open channels, and start streaming in seconds. No installs and no uploads—everything runs on your device. Great for testing playlists, checking streams, or watching your own IPTV anywhere.",

  category: "media",
  icon: "📺",

  keywords: [
    "iptv player",
    "m3u player",
    "m3u8 player",
    "play iptv online",
    "iptv player browser",
    "hls player online",
    "watch m3u playlist",
    "iptv stream player",
    "online m3u8 player",
    "browser iptv"
  ],

  tags: ["media", "video", "streaming"],

  component: () => import("./IptvPlayerTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "What formats are supported?",
      answer: "M3U and M3U8 playlists, including HLS streams."
    },
    {
      question: "Do my playlists get uploaded?",
      answer: "No. Everything runs locally in your browser."
    },
    {
      question: "Can I use a playlist URL?",
      answer: "Yes, if the source allows it (CORS enabled)."
    },
    {
      question: "Does it support live TV streams?",
      answer: "Yes. It works with most live HLS IPTV streams."
    },
    {
      question: "Do I need to install anything?",
      answer: "No. Just open the tool and start playing."
    },
    {
      question: "Can I use it on mobile?",
      answer: "Yes. It works on modern phones and tablets."
    },
    {
      question: "Why won’t some streams play?",
      answer: "Some providers block playback or require authentication."
    },
    {
      question: "Is there a limit on playlist size?",
      answer: "Large playlists depend on your device and browser performance."
    },
    {
      question: "Can I switch channels easily?",
      answer: "Yes. The player lists channels so you can switch quickly."
    },
    {
      question: "Is this legal to use?",
      answer: "The player is legal. Make sure you have rights to the streams you watch."
    }
  ],

  howItWorks:
    "Upload a playlist file or paste a URL. The player loads the channels and lets you play them instantly in your browser.",

  relatedTools: ["video-converter", "audio-converter", "media-metadata"],

  schemaType: "WebApplication",
  createdAt: "2026-03-05",
  launchedAt: "2026-03-05",
  lastUpdated: "2026-03-19",
};