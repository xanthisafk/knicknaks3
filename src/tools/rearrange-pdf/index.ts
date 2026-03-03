import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Rearrange PDF Pages",
  slug: "rearrange-pdf",
  description: "Reorder pages in a PDF by dragging and dropping — all in your browser.",
  longDescription:
    "Upload a PDF and visually reorder its pages. Click move buttons to rearrange, " +
    "then save the new order as a PDF. All local, powered by pdf-lib.",
  category: "pdf",
  icon: "🔀",
  keywords: ["pdf", "rearrange", "reorder", "move", "pages", "sort"],
  tags: ["pdf", "edit"],

  component: () => import("./RearrangePdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  howItWorks:
    "Upload a PDF to see page thumbnails. Use the arrow buttons to reorder pages, then click Save to download.",

  relatedTools: ["merge-pdf", "split-pdf", "rotate-pdf", "delete-pdf-pages"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
