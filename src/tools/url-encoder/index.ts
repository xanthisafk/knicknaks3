import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "URL Encoder / Decoder",
  slug: "url-encoder",
  description: "Encode or decode URL components with percent-encoding for safe use in web addresses.",
  longDescription:
    "Safely encode special characters in URLs using percent-encoding, or decode percent-encoded strings " +
    "back to readable text. Supports both encodeURIComponent and encodeURI modes.",
  category: "encoders",
  icon: "🔗",
  keywords: ["url", "encode", "decode", "percent", "encoding", "uri", "web", "address"],
  tags: ["encoding", "web", "url"],

  component: () => import("./UrlEncoderTool"),

  capabilities: {
    supportsClipboard: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "What is URL encoding?",
      answer:
        "URL encoding (percent-encoding) replaces unsafe characters with a % followed by their hex code. " +
        "For example, a space becomes %20 and & becomes %26.",
    },
    {
      question: "What is the difference between encodeURI and encodeURIComponent?",
      answer:
        "encodeURI encodes a full URL, preserving :, /, ?, #, etc. encodeURIComponent encodes everything, " +
        "making it safe for use as a query parameter value.",
    },
  ],

  howItWorks:
    "Paste text or a URL in the input field. Choose between Encode and Decode modes. " +
    "Select full URI or component encoding. The result updates in real-time.",

  relatedTools: ["base64", "html-entities"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
