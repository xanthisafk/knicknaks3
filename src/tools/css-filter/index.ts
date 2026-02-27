import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "CSS Filter Generator",
  slug: "css-filter",
  description: "Adjust brightness, contrast, saturation, blur, hue-rotate and more — generates filter CSS instantly.",
  category: "dev",
  icon: "🔆",
  keywords: ["css", "filter", "brightness", "contrast", "saturation", "blur", "hue", "sepia", "grayscale"],
  tags: ["design", "css", "developer"],
  component: () => import("./CssFilterTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "What filters are supported?", answer: "Brightness, contrast, saturation, grayscale, sepia, hue-rotate, blur, invert, and opacity." },
  ],
  howItWorks: "Upload or use a demo image, adjust the sliders, see the filtered result live, and copy the CSS filter string.",
  relatedTools: ["box-shadow", "gradient-maker"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
