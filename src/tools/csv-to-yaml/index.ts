import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "CSV to YAML",
  slug: "csv-to-yaml",
  description: "Convert CSV data into YAML format",
  category: "converters",
  icon: "🔁",
  keywords: ["csv","yaml","convert","csv to yaml","data transform"],

  component: () => import("./CsvToYamlTool"),

  capabilities: {
    supportsOffline: true,
  },

  createdAt: "2026-03-30",
};
