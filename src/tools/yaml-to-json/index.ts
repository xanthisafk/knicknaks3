import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "YAML to JSON",
  slug: "yaml-to-json",
  description: "Convert YAML into JSON format",
  category: "converters",
  icon: "🔁",
  keywords: ["yaml","json","convert","yaml to json","parser","data transform"],

  component: () => import("./YamlToJsonTool"),

  capabilities: {
    supportsOffline: true,
  },

  createdAt: "2026-03-30",
};
