import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "HTML Entity Converter",
  slug: "html-entities",
  description: "Securely escape or unescape HTML entities (&lt;, &gt;, &amp;, etc.) for safe web embedding.",
  longDescription: "Protect your web applications from XSS formatting errors with our HTML Entity Converter. Safely encode special characters (like `<`, `>`, `&`, `\"`) into browser-safe HTML entities, or paste entity-encoded strings to instantly decode them back to readable characters.",
  category: "encoders",
  icon: "🏷️",
  keywords: ["html entity encoder", "escape html characters", "unescape html strings", "convert to html entities", "xss prevention tool", "html syntax encoder", "decode ampersand gt lt"],
  tags: ["html", "encoding", "web"],
  component: () => import("./HtmlEntitiesTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  faq: [
    { question: "What exactly are HTML entities?", answer: "HTML entities are specific character sequences starting with an ampersand (`&`) and ending with a semicolon (`;`). They represent reserved characters in HTML syntax. For instance, `<` becomes `&lt;` and `&` becomes `&amp;`." },
    { question: "Why do I need to escape HTML?", answer: "If you want to display code snippets or user-submitted text on a webpage, you must escape reserved characters like `<` and `>`. If left unescaped, the browser will attempt to mistakenly render them as actual HTML elements, potentially breaking your layout or causing security vulnerabilities (XSS)." },
    { question: "Does it support extended named entities?", answer: "Yes. The decoder can handle common named entities (like `&copy;` for the copyright symbol) as well as numeric character references." }
  ],
  howItWorks: "Paste any text containing special characters into the input area. Choose 'Encode' to systematically convert risky characters to safe HTML entities, or 'Decode' to translate an entity-encoded string back into standard human-readable characters.",
  relatedTools: ["url-encoder", "base64", "string-escaper"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
