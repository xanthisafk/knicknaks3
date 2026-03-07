import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Base64 Encoder / Decoder",
  slug: "base64",
  description: "Encode and decode text and data to/from Base64",
  longDescription:
    "Convert text to Base64 encoding and back with our developer-friendly Base64 Encoder / Decoder tool. Supports standard Base64 (RFC 4648) and URL-safe Base64 variants. " +
    "Features live on-the-fly conversion mode, character counting, clipboard integration, and one-click input/output swapping for seamless data handling.",
  category: "encoders",
  icon: "🔄",
  keywords: ["base64 encoder", "base64 decoder", "url safe base64", "btoa function online", "atob", "encode to base64", "binary to text encoding", "base64 conversion tool"],
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
        "Base64 is a widespread binary-to-text encoding scheme that represents binary data using 64 ASCII characters (A-Z, a-z, 0-9, +, /). " +
        "It's primarily used for safely encoding data in URLs, sending email attachments, and embedding data URIs in CSS and HTML.",
    },
    {
      question: "What is URL-safe Base64?",
      answer:
        "URL-safe Base64 replaces the plus `+` and slash `/` characters with a minus `-` and underscore `_`, and commonly removes the trailing `=` padding. " +
        "This adaptation guarantees the encoded string is safe to use directly inside URL routes or query parameters without requiring further percent-encoding.",
    },
    {
      question: "Is this Base64 tool safe to use with sensitive data?",
      answer:
        "Yes. All Base64 encoding and decoding operations happen locally inside your browser using JavaScript. Absolutely no text or data is transmitted to or stored on external servers.",
    },
  ],

  howItWorks:
    "Paste your raw string into the text area to immediately view the Base64-encoded string. " +
    "Switch to 'Decode' mode to unwrap encoded Base64 back into readable text. Select 'URL-safe' mode to strip special symbols and output web-friendly strings.",

  relatedTools: ["url-encoder", "hash-generator"],

  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
