import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Base64 Encoder / Decoder",
  slug: "base64",
  description: "Encode and decode text to/from Base64 format with URL-safe and live mode support.",
  longDescription:
    "Convert text to Base64 encoding and back. Supports standard Base64 (RFC 4648) and URL-safe Base64. " +
    "Features live conversion mode, character counting, clipboard integration, and input/output swapping.",
  category: "encoders",
  icon: "🔄",
  keywords: ["base64", "encode", "decode", "binary", "text", "conversion", "btoa", "atob"],
  tags: ["encoding", "conversion", "text"],

  component: () => import("./Base64Tool.tsx"),

  capabilities: {
    supportsClipboard: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "What is Base64 encoding?",
      answer:
        "Base64 is a binary-to-text encoding scheme that represents binary data using 64 ASCII characters (A-Z, a-z, 0-9, +, /). " +
        "It's commonly used for encoding data in URLs, emails, and data URIs.",
    },
    {
      question: "What is URL-safe Base64?",
      answer:
        "URL-safe Base64 replaces the + and / characters with - and _, and removes trailing = padding. " +
        "This makes the encoded string safe for use in URLs without percent-encoding.",
    },
    {
      question: "Does this tool send my data anywhere?",
      answer:
        "No. All encoding and decoding happens entirely in your browser. No data is transmitted to any server.",
    },
  ],

  howItWorks:
    "Paste your text in the input field and see the Base64-encoded result instantly (in live mode). " +
    "Toggle to decode mode to convert Base64 back to readable text. Enable URL-safe mode for web-friendly output.",

  relatedTools: ["url-encoder", "hash-generator", "binary-converter"],

  schemaType: "WebApplication",
  lastUpdated: "2026-02-25",
};
