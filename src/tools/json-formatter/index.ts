import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "JSON Formatter",
  slug: "json-formatter",
  description: "Instantly beautify, minify, and strictly validate JSON code with custom syntax highlighting.",
  longDescription:
    "Transform unreadable, minified JSON strings into perfectly indented, human-readable data trees. Customizable output lets you dictate exact indentation formatting (2 spaces, 4 spaces, or tabs). " +
    "Conversely, compress bloated JSON into a single line for lightweight production use. Includes robust, real-time syntax validation with highly detailed, pinpointed error messages.",
  category: "formatters",
  icon: "📋",
  keywords: ["json formatter online", "json beautifier", "minify json data", "json validator tool", "pretty print json", "parse json string", "fix invalid json"],
  tags: ["json", "formatting", "developer"],

  component: () => import("./JsonFormatterTool"),

  capabilities: {
    supportsClipboard: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "What indentation options are available?",
      answer: "You can meticulously format your code using 2 spaces, 4 spaces, or hard tabs. Alternatively, you can completely minify the JSON structure down to a single compact line.",
    },
    {
      question: "Does it validate JSON syntax?",
      answer:
        "Yes. If you paste an invalid or abruptly truncated JSON payload, the tool halts formatting and visually flags a detailed parsing error, explicitly noting the exact character position causing the failure.",
    },
    {
      question: "Can it handle huge JSON payloads?",
      answer: "Yes, our editor is highly optimized to handle dense JSON files up to several megabytes in size instantly directly within your browser's memory."
    }
  ],

  howItWorks:
    "Paste your raw JSON payload into the input editor. Select your preferred indentation depth and click 'Format' to pretty-print. " +
    "Syntactically invalid JSON will immediately trigger an explicit error flag detailing its precise location. Click 'Minify' to aggressively strip out all whitespace for production optimization.",

  relatedTools: ["json-validator", "json-to-csv", "yaml-formatter"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
