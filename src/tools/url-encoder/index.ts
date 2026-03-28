import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "URL Encoder & Decoder (Percent Encoding Tool)",
  slug: "url-encoder",
  description: "Encode or decode URLs and query strings.",
  category: "encoders",
  icon: "🔗",
  keywords: [
    "url encoder",
    "url decoder",
    "percent encoding tool",
    "encode url online",
    "decode url string",
    "encodeURIComponent tool",
    "decodeURIComponent online",
    "url encoding example",
    "convert spaces to %20",
    "query string encoder"
  ],
  tags: ["encoding", "web", "url", "developer"],

  component: () => import("./UrlEncoderTool"),

  capabilities: {
    supportsClipboard: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "What is URL encoding?",
      answer: "URL encoding (percent encoding) converts unsafe characters into a % followed by hexadecimal values so they can be safely used in URLs."
    },
    {
      question: "What is a URL decoder?",
      answer: "A URL decoder reverses percent encoding, converting encoded sequences like %20 back into readable characters."
    },
    {
      question: "What is the difference between encodeURI and encodeURIComponent?",
      answer: "encodeURI preserves URL structure characters, while encodeURIComponent encodes everything, making it ideal for query parameters."
    },
    {
      question: "When should I use encodeURIComponent?",
      answer: "Use encodeURIComponent when encoding query parameter values to prevent breaking the URL structure."
    },
    {
      question: "Why do spaces become %20 in URLs?",
      answer: "Spaces are not valid in URLs, so they are encoded as %20 to ensure proper transmission."
    },
    {
      question: "Can I decode malformed URLs?",
      answer: "If the encoding is invalid or incomplete, decoding may fail and return an error."
    },
    {
      question: "Is this tool safe to use?",
      answer: "Yes, all encoding and decoding happens locally in your browser with no data sent to servers."
    },
    {
      question: "Does this support full URLs and query strings?",
      answer: "Yes, you can encode or decode entire URLs or just individual query parameters."
    },
    {
      question: "What characters get encoded?",
      answer: "Special characters like spaces, symbols, and reserved URL characters are encoded into percent format."
    },
    {
      question: "Is this tool free?",
      answer: "Yes, it is completely free and works offline."
    }
  ],

  howItWorks:
    "Enter text or a URL, choose encode or decode mode, and the tool instantly converts it using standard JavaScript encoding functions.",

  relatedTools: ["base64", "html-entities", "url-builder"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-29",
};