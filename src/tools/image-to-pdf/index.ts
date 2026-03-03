import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Image to PDF",
  slug: "image-to-pdf",
  description: "Convert images to a PDF document — one image per page, all in your browser.",
  longDescription:
    "Upload multiple images (PNG, JPG, WebP) and combine them into a single PDF with one image per page. " +
    "Reorder before converting. All local using pdf-lib.",
  category: "pdf",
  icon: "🖼️",
  keywords: ["image", "pdf", "convert", "photo", "jpg", "png", "picture"],
  tags: ["pdf", "converter"],

  component: () => import("./ImageToPdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  howItWorks:
    "Upload image files, reorder if needed, then click Convert to get a PDF with one image per page.",

  relatedTools: ["pdf-to-images", "merge-pdf", "compress-pdf"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
