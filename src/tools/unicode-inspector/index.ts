import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Unicode Inspector",
  slug: "unicode-inspector",
  description: "Inspect Unicode characters, code points, UTF-8 bytes, and encodings.",
  category: "dev",
  icon: "🔬",

  keywords: [
    "unicode inspector",
    "unicode analyzer",
    "character code point finder",
    "utf8 byte calculator",
    "utf16 converter",
    "unicode to hex",
    "emoji unicode decoder",
    "identify unicode character",
    "what unicode is this",
    "text encoding analyzer",
    "unicode breakdown tool",
    "string byte size calculator",
    "utf8 vs utf16",
    "unicode debugger"
  ],

  tags: ["developer", "encoding", "unicode", "text"],

  component: () => import("./UnicodeInspectorTool"),

  capabilities: { supportsOffline: true, supportsClipboard: true },

  faq: [
    {
      question: "What is a Unicode code point?",
      answer:
        "A code point is the numeric identifier assigned to a character in Unicode, written as U+XXXX. For example, 'A' is U+0041."
    },
    {
      question: "What is the difference between UTF-8 and UTF-16?",
      answer:
        "UTF-8 uses 1-4 bytes per character and is optimized for web usage, while UTF-16 uses 2 or 4 bytes and is common in internal system representations."
    },
    {
      question: "How many bytes does a character use in UTF-8?",
      answer:
        "ASCII characters use 1 byte, extended characters use 2-3 bytes, and emojis or complex symbols can use up to 4 bytes."
    },
    {
      question: "Why do some emojis appear as multiple characters?",
      answer:
        "Many emojis are composed of multiple Unicode code points joined together using zero-width joiners (ZWJ), creating a single visual symbol."
    },
    {
      question: "Can I identify unknown or strange characters?",
      answer:
        "Yes. Paste any symbol or text to see its Unicode code point, encoding, and category instantly."
    },
    {
      question: "What is a Unicode block or category?",
      answer:
        "Unicode groups characters into ranges called blocks (e.g., Latin, Cyrillic, Emoji) to organize scripts and symbol sets."
    },
    {
      question: "What is UTF-8 encoding used for?",
      answer:
        "UTF-8 is the most widely used text encoding on the web, ensuring compatibility across systems and languages."
    },
    {
      question: "How do I convert a character to hex or bytes?",
      answer:
        "This tool automatically shows hexadecimal code points and byte-level encodings for every character you input."
    },
    {
      question: "Why does text sometimes break or display incorrectly?",
      answer:
        "Encoding mismatches (e.g., UTF-8 vs UTF-16) can cause corrupted text. Inspecting byte representations helps diagnose these issues."
    },
    {
      question: "Is this useful for developers?",
      answer:
        "Yes. It's designed for debugging encoding issues, inspecting strings, and understanding how text is represented at the byte level."
    }
  ],

  howItWorks:
    "Paste any text to instantly analyze each character's Unicode code point, encoding (UTF-8/UTF-16), and category. Click characters to inspect detailed byte-level data.",

  relatedTools: [
    "html-entities",
    "base64",
    "text-to-ascii",
    "text-to-hex"
  ],

  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-28",
};