import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "JSON to YAML",
  slug: "json-to-yaml",
  description: "Convert JSON data into YAML format",
  category: "converters",
  icon: "🔁",
  keywords: ["json","yaml","convert","json to yaml","serializer","data transform"],

  component: () => import("./JsonToYamlTool"),

  capabilities: {
    supportsOffline: true,
  },

  createdAt: "2026-03-30",
};
