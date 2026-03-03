import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Rotate PDF Pages",
  slug: "rotate-pdf",
  description: "Rotate PDF pages by 90°, 180°, or 270° — all in your browser.",
  longDescription:
    "Upload a PDF and rotate all pages or specific pages by 90, 180, or 270 degrees. " +
    "Processing is done locally with pdf-lib. No uploads required.",
  category: "pdf",
  icon: "🔄",
  keywords: ["pdf", "rotate", "orientation", "landscape", "portrait", "turn"],
  tags: ["pdf", "rotate"],

  component: () => import("./RotatePdfTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  howItWorks:
    "Upload a PDF, choose the rotation angle and which pages to rotate, then click Rotate & Download.",

  relatedTools: ["merge-pdf", "split-pdf", "rearrange-pdf"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
