import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Tailwind Color Reference",
  slug: "tailwind-colors",
  description: "Searchable Tailwind CSS v3/v4 color palette with HEX values and one-click copy.",
  category: "dev",
  icon: "🐦",
  keywords: ["tailwind", "color", "palette", "css", "reference", "hex", "slate", "zinc", "design"],
  tags: ["design", "css", "tailwind", "reference"],
  component: () => import("./TailwindColorsTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "Which Tailwind version?", answer: "Includes both v3 and v4 palettes. Toggle between them in the tool." },
  ],
  howItWorks: "Browse or search for a color family. Click any swatch to copy its HEX value or className to clipboard.",
  relatedTools: ["color-converter", "palette-generator", "gradient-maker"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
