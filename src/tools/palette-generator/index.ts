import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Color Palette Generator",
  slug: "palette-generator",
  description: "Generate harmonious color schemes — triadic, analogous, complementary, monochromatic — from a seed color.",
  category: "converters",
  icon: "🎨",
  keywords: ["color", "palette", "scheme", "generator", "triadic", "analogous", "complementary", "monochromatic", "hsl", "hex"],
  tags: ["color", "design", "css"],
  component: () => import("./PaletteGeneratorTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "What is a color scheme?", answer: "A set of colors chosen based on their relationships on the color wheel — complementary colors are opposite, analogous are adjacent." },
  ],
  howItWorks: "Pick a seed color, choose a harmony type, and get a full palette with HEX and HSL values ready to copy.",
  relatedTools: ["color-converter", "contrast-checker", "gradient-maker"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
