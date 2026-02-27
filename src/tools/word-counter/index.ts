import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Word & Character Counter",
  slug: "word-counter",
  description: "Count words, characters, sentences, paragraphs, and estimate reading time in real-time.",
  longDescription:
    "Real-time text analytics tool that counts words, characters (with and without spaces), sentences, " +
    "paragraphs, and lines. Also estimates reading time and speaking time based on average speeds.",
  category: "text",
  icon: "📝",
  keywords: ["word", "character", "count", "counter", "text", "length", "reading time", "statistics"],
  tags: ["text", "analytics", "writing"],

  component: () => import("./WordCounterTool"),

  capabilities: {
    supportsClipboard: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "How is reading time calculated?",
      answer:
        "Reading time is estimated based on an average reading speed of 200 words per minute (WPM), " +
        "which is the standard for adult English readers.",
    },
    {
      question: "Does it count special characters?",
      answer:
        "Yes. The 'Characters' count includes all characters including spaces and special characters. " +
        "'Characters (no spaces)' excludes only whitespace.",
    },
  ],

  howItWorks:
    "Paste or type your text in the input area. Statistics update in real-time as you type. " +
    "Word count uses whitespace splitting, sentences are detected by punctuation boundaries, " +
    "and paragraphs are separated by blank lines.",

  relatedTools: ["case-converter", "text-sorter", "lorem-ipsum"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
