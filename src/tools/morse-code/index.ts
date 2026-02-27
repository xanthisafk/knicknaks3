import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text to Morse Code",
  slug: "morse-code",
  description: "Encode and decode Morse code with audio playback via Web Audio API.",
  category: "encoders",
  icon: "📡",
  keywords: ["morse", "code", "encode", "decode", "audio", "dots", "dashes", "signal", "telegraph"],
  tags: ["encoding", "audio", "fun"],
  component: () => import("./MorseCodeTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "Can I hear the Morse code?", answer: "Yes — click Play to hear the Morse code as audio tones using the Web Audio API." },
    { question: "What characters are supported?", answer: "All English letters, digits 0–9, and common punctuation." },
  ],
  howItWorks: "Type text to encode it to dots and dashes, or enter Morse code to decode it. Click Play to hear the audio.",
  relatedTools: ["text-to-hex", "base64"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
