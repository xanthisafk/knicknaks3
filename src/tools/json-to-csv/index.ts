import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "JSON to CSV",
  slug: "json-to-csv",
  description: "Convert JSON arrays into CSV format",
  category: "converters",
  icon: "🔧",
  keywords: ["json","csv","convert","json to csv","tabular","data export"],

  component: () => import("./JsonToCsvTool"),

  capabilities: {
    supportsOffline: true,
  },

  createdAt: "2026-03-30",
};
