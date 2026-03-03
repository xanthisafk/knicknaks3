import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Delete PDF Pages",
  slug: "delete-pdf-pages",
  description: "Remove selected pages from a PDF document, entirely in your browser.",
  longDescription:
    "Upload a PDF and specify which pages to remove. The remaining pages are saved as a new PDF. " +
    "All processing is local using pdf-lib.",
  category: "pdf",
  icon: "🗑️",
  keywords: ["pdf", "delete", "remove", "pages", "trim"],
  tags: ["pdf", "edit"],

  component: () => import("./DeletePdfPagesTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  howItWorks:
    "Upload a PDF, enter the page numbers to delete, and click Remove. " +
    "A new PDF without those pages will be downloaded.",

  relatedTools: ["split-pdf", "rearrange-pdf", "rotate-pdf"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
