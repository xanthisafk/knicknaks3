import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "TOML to JSON",
  slug: "toml-to-json",
  description: "Convert TOML into JSON format",
  category: "converters",
  icon: "🔁",
  keywords: ["toml","json","convert","toml to json","parser"],

  component: () => import("./TomlToJsonTool"),

  capabilities: {
    supportsOffline: true,
  },

  createdAt: "2026-03-30",
};
