import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "DeepDanbooru Image Tagger",
  slug: "deep-danbooru",
  description: "Runs AI (SmilingWolf's ConvNext V2) locally to tag anime-style images without uploading them.",
  category: "ai",
  icon: "🔖",
  keywords: ["tagger", "anime", "danbooru", "tags", "ai", "image"],

  component: () => import("./DeepDanbooruTool"),

  capabilities: {
    supportsOffline: true,
  },

  createdAt: "2026-03-25",
};
