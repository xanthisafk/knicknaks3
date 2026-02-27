import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Gradient Maker",
  slug: "gradient-maker",
  description: "Visual multi-stop CSS gradient builder with linear/radial/conic modes and copy-ready output.",
  category: "converters",
  icon: "🌈",
  keywords: ["gradient", "css", "linear", "radial", "conic", "color", "background", "design"],
  tags: ["color", "design", "css"],
  component: () => import("./GradientMakerTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "What gradient types are supported?", answer: "Linear, radial, and conic gradients with multiple color stops and custom angles." },
  ],
  howItWorks: "Add color stops, choose a gradient type, adjust angle and positions, preview live, and copy the CSS.",
  relatedTools: ["color-converter", "palette-generator", "box-shadow"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
