import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text to Slug",
  slug: "text-to-slug",
  description: "Convert text into clean, URL-friendly slugs by removing special characters.",
  category: "text",
  icon: "🔗",
  keywords: ["slug", "url", "text", "convert", "seo", "permalink", "friendly"],
  tags: ["text", "url", "seo"],
  component: () => import("./TextToSlugTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  howItWorks: "Type or paste text and get a clean URL slug instantly. Special characters are removed, spaces become hyphens, and everything is lowercased.",
  relatedTools: ["case-converter", "url-encoder"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
