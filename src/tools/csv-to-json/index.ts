import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "CSV to JSON",
  slug: "csv-to-json",
  description: "Convert CSV to JSON online free. Fast, secure, and works in your browser.",
  category: "converters",
  icon: "🔁",
  keywords: [
    "csv to json",
    "convert csv to json online",
    "csv to json converter free",
    "csv to json parser",
    "csv file to json",
    "comma separated to json",
    "csv to nested json",
    "csv to json javascript",
    "upload csv convert json",
    "data conversion csv json"
  ],
  tags: ["data", "conversion", "developer"],

  component: () => import("./CsvToJsonTool"),

  capabilities: {
    supportsOffline: true,
    supportsFileInput: true,
    supportsClipboard: true,
  },

  faq: [
    {
      question: "How do I convert CSV to JSON?",
      answer: "Paste your CSV data or upload a file, adjust parsing options if needed, and instantly get JSON output."
    },
    {
      question: "Can I upload a CSV file?",
      answer: "Yes, you can upload a .csv file and it will be automatically parsed into JSON."
    },
    {
      question: "What does the header option do?",
      answer: "When enabled, the first row is used as JSON keys. When disabled, rows are returned as arrays."
    },
    {
      question: "What is dynamic typing?",
      answer: "It automatically converts values like numbers and booleans from strings into proper data types."
    },
    {
      question: "Can I change the delimiter?",
      answer: "Yes, you can specify a custom separator such as comma, tab, or semicolon."
    },
    {
      question: "Does this support large CSV files?",
      answer: "Yes, performance depends on your browser and device, but most modern systems handle large files smoothly."
    },
    {
      question: "Is this CSV to JSON converter free?",
      answer: "Yes, it is completely free with no limits or sign-up required."
    },
    {
      question: "Are my files uploaded to a server?",
      answer: "No, all parsing happens locally in your browser for maximum privacy."
    },
    {
      question: "Can I download the JSON output?",
      answer: "Yes, you can download the formatted JSON file with a custom filename."
    },
    {
      question: "What is metadata mode?",
      answer: "It includes additional parsing details like errors, delimiter info, and row counts along with the data."
    }
  ],

  howItWorks:
    "Paste CSV or upload a file, configure parsing options like headers and delimiter, then instantly convert and download JSON.",

  relatedTools: ["json-to-csv", "xml-to-json", "text-to-json"],
  schemaType: "WebApplication",
  createdAt: "2026-03-30",
  launchedAt: "2026-03-31",
  updatedAt: "2026-03-31",
};
