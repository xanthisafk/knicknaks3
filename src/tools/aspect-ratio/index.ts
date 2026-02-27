import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Aspect Ratio Calculator",
  slug: "aspect-ratio",
  description: "Calculate and maintain proportional dimensions for images, video, and UI design.",
  category: "calculators",
  icon: "📐",
  keywords: ["aspect", "ratio", "dimensions", "width", "height", "scale", "image", "video", "responsive"],
  tags: ["design", "media", "calculator"],
  component: () => import("./AspectRatioTool"),
  capabilities: { supportsOffline: true },
  faq: [
    { question: "Common ratios?", answer: "16:9 (HD video), 4:3 (old monitors), 1:1 (square), 3:2 (photos), 21:9 (ultrawide)." },
  ],
  howItWorks: "Enter two dimensions and solve for a third, or pick a common ratio and get the matching dimension.",
  relatedTools: ["placeholder-image", "contrast-checker"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
