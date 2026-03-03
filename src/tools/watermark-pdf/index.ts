import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Watermark PDF",
  slug: "watermark-pdf",
  description: "Add text or image watermarks to PDF pages — all in your browser.",
  longDescription:
    "Upload a PDF and overlay a custom text watermark on every page with configurable opacity, " +
    "rotation, and font size. All local, no data leaves your device.",
  category: "pdf",
  icon: "💧",
  keywords: ["pdf", "watermark", "stamp", "overlay", "branding", "draft"],
  tags: ["pdf", "edit"],

  component: () => import("./WatermarkPdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  howItWorks:
    "Upload a PDF, type your watermark text, adjust opacity and rotation, then click Apply & Download.",

  relatedTools: ["pdf-page-numbers", "rotate-pdf", "protect-pdf"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
