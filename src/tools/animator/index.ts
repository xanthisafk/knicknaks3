import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Animator",
  slug: "animator",
  description: "Animate simple flipbook sketches",
  category: "creative",
  icon: "👻",
  keywords: ["animation", "flipbook", "cartoon", "drawing"],

  component: () => import("./AnimatorTool"),

  capabilities: {
    supportsOffline: true,
  },

  createdAt: "2026-04-05",
};
