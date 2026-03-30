import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "JSON to TOML",
  slug: "json-to-toml",
  description: "Convert JSON into TOML format",
  category: "converters",
  icon: "🔁",
  keywords: ["json","toml","convert","json to toml","config"],

  component: () => import("./JsonToTomlTool"),

  capabilities: {
    supportsOffline: true,
  },

  createdAt: "2026-03-30",
};
