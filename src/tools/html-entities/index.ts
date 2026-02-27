import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "HTML Entity Converter",
  slug: "html-entities",
  description: "Escape and unescape HTML entities like &lt;, &gt;, &amp;, and more for safe embedding.",
  category: "encoders",
  icon: "🏷️",
  keywords: ["html", "entity", "escape", "unescape", "encode", "decode", "amp", "lt", "gt"],
  tags: ["html", "encoding", "web"],
  component: () => import("./HtmlEntitiesTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  faq: [
    { question: "What are HTML entities?", answer: "HTML entities are character sequences that represent reserved characters in HTML. For example, < becomes &lt; and & becomes &amp;." },
  ],
  howItWorks: "Paste text with special characters and encode them to HTML entities, or paste entity-encoded text to decode it back to readable characters.",
  relatedTools: ["url-encoder", "base64", "string-escaper"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
