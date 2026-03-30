import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "JSON to XML",
  slug: "json-to-xml",
  description: "Convert JSON data into XML format",
  category: "converters",
  icon: "🔁",
  keywords: ["json","xml","convert","json to xml","data transform"],

  component: () => import("./JsonToXmlTool"),

  capabilities: {
    supportsOffline: true,
  },

  createdAt: "2026-03-30",
};
