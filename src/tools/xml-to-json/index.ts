import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "XML to JSON",
  slug: "xml-to-json",
  description: "Convert XML into JSON format",
  category: "converters",
  icon: "🔁",
  keywords: ["xml","json","convert","xml to json","parser"],

  component: () => import("./XmlToJsonTool"),

  capabilities: {
    supportsOffline: true,
  },

  createdAt: "2026-03-30",
};
