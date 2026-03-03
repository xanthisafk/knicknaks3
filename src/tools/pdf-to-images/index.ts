import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "PDF to Images",
  slug: "pdf-to-images",
  description: "Convert PDF pages to PNG or JPG images — all in your browser.",
  longDescription:
    "Upload a PDF and render each page as a high-quality image. Choose PNG or JPG format and resolution. " +
    "Uses pdfjs-dist for rendering. All local, no uploads.",
  category: "pdf",
  icon: "🖼️",
  keywords: ["pdf", "image", "png", "jpg", "convert", "render", "export"],
  tags: ["pdf", "converter"],

  component: () => import("./PdfToImagesTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  howItWorks:
    "Upload a PDF, choose format and quality, then click Convert. Each page is rendered to canvas and exported as an image.",

  relatedTools: ["image-to-pdf", "split-pdf", "compress-pdf"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
