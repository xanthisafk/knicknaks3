import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Markdown to PDF",
  slug: "markdown-to-pdf",
  description: "Convert Markdown text into a downloadable PDF — all in your browser.",
  longDescription:
    "Type or paste Markdown, see a live preview, and download it as a clean PDF. " +
    "Uses marked.js for rendering and pdf-lib for PDF generation. Fully local.",
  category: "pdf",
  icon: "📝",
  keywords: ["markdown", "pdf", "convert", "export", "document", "md"],
  tags: ["pdf", "converter", "markdown"],

  component: () => import("./MarkdownToPdfTool"),

  capabilities: {
    supportsClipboard: true,
    supportsOffline: true,
  },

  howItWorks:
    "Type Markdown in the editor, preview the rendered HTML, then click Export to PDF.",

  relatedTools: ["markdown-preview", "image-to-pdf", "merge-pdf"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
