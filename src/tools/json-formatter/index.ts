import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "JSON Formatter",
  slug: "json-formatter",
  description: "Beautify, minify, and validate JSON with custom indentation and syntax highlighting.",
  longDescription:
    "Paste messy JSON and instantly format it with customizable indentation (2 or 4 spaces, tabs). " +
    "Minify JSON for production use. Includes real-time validation with detailed error messages.",
  category: "formatters",
  icon: "📋",
  keywords: ["json", "format", "beautify", "minify", "validate", "pretty", "print", "indent"],
  tags: ["json", "formatting", "developer"],

  component: () => import("./JsonFormatterTool"),

  capabilities: {
    supportsClipboard: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "What indentation options are available?",
      answer: "You can format with 2 spaces, 4 spaces, or tabs. You can also minify JSON to a single line.",
    },
    {
      question: "Does it validate JSON?",
      answer:
        "Yes. If your JSON is invalid, the tool shows a detailed error message with the position of the problem.",
    },
  ],

  howItWorks:
    "Paste your JSON into the input area. Choose your preferred indentation and click Format. " +
    "Invalid JSON will show an error with its location. Use Minify to compress JSON for production.",

  relatedTools: ["json-validator", "json-to-csv", "yaml-formatter"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
