import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "YAML to CSV",
  slug: "yaml-to-csv",
  description: "Convert YAML data into CSV format",
  category: "converters",
  icon: "🔁",
  keywords: ["yaml","csv","convert","yaml to csv","data transform","tabular"],

  component: () => import("./YamlToCsvTool"),

  capabilities: {
    supportsOffline: true,
  },

  createdAt: "2026-03-30",
};
