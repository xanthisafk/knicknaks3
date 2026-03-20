import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Markdown to PDF",
  slug: "markdown-to-pdf",
  description: "Convert Markdown text into formatted PDF file",
  longDescription:
    "Write in standard Markdown format, verify the output in a live preview pane, and instantly export the final document as a high-quality PDF. " +
    "This robust tool bridges marked.js for rapid HTML rendering with pdf-lib for strict PDF generation. Fully localized zero-server architecture guarantees total privacy.",
  category: "pdf",
  icon: "📝",
  keywords: ["markdown to pdf converter", "md to pdf export", "save markdown as document", "render markdown pdf", "markdown text compiler", "local pdf generator", "github markdown to pdf"],
  tags: ["pdf", "converter", "markdown"],

  component: () => import("./MarkdownToPdfTool"),

  capabilities: {
    supportsClipboard: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "Are my documents kept private during conversion?",
      answer: "Yes, absolutely. All Markdown parsing into HTML and the subsequent PDF file generation happens exclusively within your own browser's memory using JavaScript. No text is ever transmitted."
    },
    {
      question: "Are GitHub Flavored Markdown (GFM) features supported?",
      answer: "Yes, standard GFM extensions such as data tables, code blocks, task lists, and strikethroughs are fully supported and will render correctly in the exported PDF."
    }
  ],

  howItWorks:
    "Type or paste your raw Markdown syntax into the main editor. Review the integrated live HTML preview to ensure formatting is correct, then click 'Export to PDF' to prompt a direct file download of your newly compiled document.",

  relatedTools: ["markdown-preview", "image-to-pdf", "merge-pdf"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-21",
};
