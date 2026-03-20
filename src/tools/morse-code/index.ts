import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text to Morse Code",
  slug: "morse-code",
  description: "Convert text to Morse code and play audio",
  category: "encoders",
  icon: "📡",
  keywords: [
    "morse code translator",
    "text to morse code",
    "decode morse code",
    "morse code audio",
    "dots and dashes converter",
    "learn morse code",
    "morse code player"
  ],
  tags: ["encoding", "audio", "fun"],
  component: () => import("./MorseCodeTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    {
      question: "Can I hear the Morse code?",
      answer: "Yes. Click play to hear the audio instantly."
    },
    {
      question: "What characters are supported?",
      answer: "Letters, numbers, and common punctuation."
    },
    {
      question: "How should I format Morse code?",
      answer: "Use spaces between letters and a slash or three spaces between words."
    },
    {
      question: "How are letters separated?",
      answer: "Each letter is separated by a single space."
    },
    {
      question: "How are words separated?",
      answer: "Use a slash (/) or three spaces between words."
    },
    {
      question: "What display styles are available?",
      answer: "You can switch between . - and · − styles. Both work the same."
    },
    {
      question: "Can I download the audio?",
      answer: "Yes. Use Download WAV to save the audio file."
    },
    {
      question: "Can I control playback speed?",
      answer: "Yes. Adjust the WPM setting to change speed."
    },
    {
      question: "Does it work offline?",
      answer: "Yes. Once loaded, it runs without internet."
    },
    {
      question: "Is it free to use?",
      answer: "Yes. You can translate and play Morse code for free."
    }
  ],
  howItWorks: "Type text to convert it to Morse code or paste Morse to decode it. Play the audio or download it.",
  relatedTools: ["text-to-hex", "base64"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  lastUpdated: "2026-03-21",
};