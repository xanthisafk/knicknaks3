import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "URL Parser",
  slug: "url-parser",
  description: "Deconstruct any URL into protocol, host, port, path, query params, and fragment.",
  category: "dev",
  icon: "🔗",
  keywords: ["url", "parse", "query", "params", "protocol", "host", "path", "fragment", "link"],
  tags: ["developer", "network"],
  component: () => import("./UrlParserTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "What URL formats are supported?", answer: "Any valid URL including http, https, ftp, and custom protocol URLs." },
    { question: "Can I edit the parts?", answer: "Yes — edit any individual part to rebuild the URL." },
  ],
  howItWorks: "Paste a URL and see it broken into components. Edit parts and the full URL updates automatically.",
  relatedTools: ["url-encoder", "url-builder"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
