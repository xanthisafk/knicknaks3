import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Sketchpad",
  slug: "sketchpad",
  description: "Draw on your computer",
  category: "creative",
  icon: "🌈",
  keywords: ["drawing", "sketch", "art", "paint"],

  component: () => import("./SketchpadTool"),

  capabilities: {
    supportsOffline: true,
  },

  createdAt: "2026-04-05",
};
