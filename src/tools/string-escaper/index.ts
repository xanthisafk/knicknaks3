import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "String Escaper",
  slug: "string-escaper",
  description: "Escape and unescape strings for JavaScript, JSON, HTML, CSV, and SQL contexts.",
  category: "dev",
  icon: "🛡️",
  keywords: ["escape", "unescape", "string", "javascript", "json", "html", "csv", "sql", "quotes"],
  tags: ["developer", "encoding"],
  component: () => import("./StringEscaperTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  howItWorks: "Paste a string and select the target context (JS, JSON, HTML, CSV, SQL). The tool escapes special characters appropriately.",
  relatedTools: ["html-entities", "url-encoder", "json-formatter"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
