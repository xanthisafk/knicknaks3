import type { ToolDefinition } from "../_types";

export const definition: ToolDefinition = {
  name: "JSON to CSV",
  slug: "json-to-csv",
  description: "Convert JSON to CSV online free.",
  category: "converters",
  icon: "🔁",
  keywords: [
    "json to csv",
    "convert json to csv online",
    "json to csv converter free",
    "json to csv parser",
    "json array to csv",
    "export json to csv",
    "json to spreadsheet",
    "flatten json to csv",
    "upload json convert csv",
    "data conversion json csv"
  ],
  tags: ["data", "conversion", "developer"],

  component: () => import("./JsonToCsvTool"),

  capabilities: {
    supportsOffline: true,
    supportsFileInput: true,
    supportsClipboard: true,
  },

  faq: [
    {
      question: "How do I convert JSON to CSV?",
      answer: "Paste your JSON or upload a file and the tool instantly converts it into CSV format."
    },
    {
      question: "Can I upload a JSON file?",
      answer: "Yes, you can upload a .json file and it will be converted automatically."
    },
    {
      question: "What JSON formats are supported?",
      answer: "The tool supports arrays of objects and single objects, which are automatically converted into rows."
    },
    {
      question: "Does it create column headers?",
      answer: "Yes, keys from JSON objects are used as column headers when the header option is enabled."
    },
    {
      question: "Can I change the CSV delimiter?",
      answer: "Yes, you can use commas, tabs, semicolons, or custom separators."
    },
    {
      question: "Can I preview the CSV before downloading?",
      answer: "Yes, you can view the output as a table or raw CSV before downloading."
    },
    {
      question: "Is this JSON to CSV converter free?",
      answer: "Yes, it is completely free with no limits."
    },
    {
      question: "Are my files uploaded?",
      answer: "No, all processing happens locally in your browser."
    },
    {
      question: "What happens if my JSON is invalid?",
      answer: "If the JSON cannot be parsed, no output will be generated."
    },
    {
      question: "Can I download the CSV file?",
      answer: "Yes, you can download the converted CSV with a custom filename."
    }
  ],

  howItWorks:
    "Paste JSON or upload a file, choose delimiter and options, preview the table, then download your CSV instantly.",

  relatedTools: ["csv-to-json", "xml-to-json", "text-to-json"],
  schemaType: "WebApplication",
  createdAt: "2026-03-30",
  launchedAt: "2026-03-31",
};