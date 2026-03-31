import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "CSV to YAML",
  slug: "csv-to-yaml",
  description: "Convert CSV to YAML online free.",
  category: "converters",
  icon: "🔁",
  keywords: [
    "csv to yaml",
    "convert csv to yaml online",
    "csv to yaml converter free",
    "csv to yaml parser",
    "csv file to yaml",
    "comma separated to yaml",
    "csv to yaml format",
    "data conversion csv yaml",
    "upload csv convert yaml",
    "csv to yaml javascript"
  ],
  tags: ["data", "conversion", "developer"],

  component: () => import("./CsvToYamlTool"),

  capabilities: {
    supportsOffline: true,
    supportsFileInput: true,
    supportsClipboard: true,
  },

  faq: [
    {
      question: "How do I convert CSV to YAML?",
      answer: "Paste your CSV data or upload a file and it will instantly convert into YAML format."
    },
    {
      question: "Can I upload a CSV file?",
      answer: "Yes, you can upload a .csv file and it will be parsed automatically."
    },
    {
      question: "What does the header option do?",
      answer: "When enabled, the first row is used as keys in the YAML output instead of plain arrays."
    },
    {
      question: "Can I change the delimiter?",
      answer: "Yes, you can use commas, tabs, semicolons, or custom separators."
    },
    {
      question: "Does it support data types?",
      answer: "Yes, with dynamic typing enabled, numbers and booleans are preserved instead of strings."
    },
    {
      question: "Is this CSV to YAML converter free?",
      answer: "Yes, it is completely free with no usage limits."
    },
    {
      question: "Are my files uploaded to a server?",
      answer: "No, all processing happens locally in your browser."
    },
    {
      question: "Can I download the YAML output?",
      answer: "Yes, you can download the converted YAML file with a custom filename."
    },
    {
      question: "What happens if the CSV is invalid?",
      answer: "If the CSV cannot be parsed correctly, no output will be generated."
    },
    {
      question: "Who is this tool for?",
      answer: "It's useful for developers, DevOps workflows, config generation, and data transformation tasks."
    }
  ],

  howItWorks:
    "Paste CSV or upload a file, configure parsing options, then instantly convert and download YAML.",

  relatedTools: ["csv-to-json", "json-to-yaml", "xml-to-json"],
  schemaType: "WebApplication",
  createdAt: "2026-03-30",
  launchedAt: "2026-03-31",
};