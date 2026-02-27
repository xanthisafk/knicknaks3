import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Markdown Previewer",
  slug: "markdown-preview",
  description: "Live side-by-side Markdown editor with instant rendered preview using marked.js.",
  category: "text",
  icon: "📄",
  keywords: ["markdown", "preview", "md", "render", "live", "editor", "github"],
  tags: ["markdown", "text", "writing"],
  component: () => import("./MarkdownPreviewTool"),
  capabilities: { supportsClipboard: true, supportsOffline: true },
  faq: [
    { question: "What Markdown syntax is supported?", answer: "Standard Markdown (CommonMark) plus GFM extensions like tables, strikethrough, task lists, and autolinks." },
    { question: "Can I export the rendered HTML?", answer: "Yes, use the Copy HTML button to get the rendered HTML output." },
  ],
  howItWorks: "Type Markdown in the editor on the left and see the rendered preview on the right in real-time. Uses the marked.js library for parsing.",
  relatedTools: ["word-counter", "lorem-ipsum"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
