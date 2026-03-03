import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Add Page Numbers",
  slug: "pdf-page-numbers",
  description: "Overlay page numbers on every page of a PDF — all in your browser.",
  longDescription:
    "Upload a PDF and add page numbers at your chosen position (top/bottom, left/center/right). " +
    "Customize font size and starting number. All processing is local using pdf-lib.",
  category: "pdf",
  icon: "🔢",
  keywords: ["pdf", "page", "numbers", "overlay", "footer", "header"],
  tags: ["pdf", "edit"],

  component: () => import("./PdfPageNumbersTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  howItWorks:
    "Upload a PDF, choose the position and font size for page numbers, then click Add & Download.",

  relatedTools: ["watermark-pdf", "rotate-pdf", "merge-pdf"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
