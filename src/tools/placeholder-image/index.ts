import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Placeholder Image Generator",
  slug: "placeholder-image",
  description: "Generate SVG placeholder images with custom dimensions, text, colors — no external CDN needed.",
  category: "generators",
  icon: "🖼️",
  keywords: ["placeholder", "image", "svg", "dummy", "mock", "generator", "design", "size"],
  tags: ["design", "generator", "images"],
  component: () => import("./PlaceholderImageTool"),
  capabilities: { supportsOffline: true },
  faq: [
    { question: "What formats are generated?", answer: "Pure SVG data URIs and downloadable SVG files — no external image service required." },
  ],
  howItWorks: "Set width and height, customize background/text colors and label, then copy the data URI or download the SVG.",
  relatedTools: ["aspect-ratio", "color-converter"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
