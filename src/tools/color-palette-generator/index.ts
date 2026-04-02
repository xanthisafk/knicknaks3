import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Color Palette Generator",
  slug: "color-palette-generator",
  description: "Generate random color palette for your projects",
  category: "generators",
  icon: "🎨",
  keywords: ["color palette generator","random color generator"],

  component: () => import("./ColorPaletteGeneratorTool"),

  capabilities: {
    supportsOffline: true,
  },

  createdAt: "2026-04-02",
};
