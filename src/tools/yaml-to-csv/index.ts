import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "YAML to CSV",
  slug: "yaml-to-csv",
  description: "Convert YAML to CSV online",
  category: "converters",
  icon: "🔁",
  keywords: [
    "yaml to csv",
    "convert yaml to csv online",
    "yaml to csv converter free",
    "yaml to csv parser",
    "yaml to spreadsheet",
    "yaml to table converter",
    "flatten yaml to csv",
    "yaml file to csv",
    "data conversion yaml csv",
    "upload yaml convert csv"
  ],
  tags: ["data", "conversion", "developer"],

  component: () => import("./YamlToCsvTool"),

  capabilities: {
    supportsOffline: true,
    supportsFileInput: true,
    supportsClipboard: true,
  },

  faq: [
    {
      question: "How do I convert YAML to CSV?",
      answer: "Paste your YAML or upload a file and it will instantly convert into CSV format."
    },
    {
      question: "Can I upload a YAML file?",
      answer: "Yes, you can upload .yaml or .yml files for automatic conversion."
    },
    {
      question: "Does it support nested YAML?",
      answer: "Yes, nested objects are flattened into a tabular CSV structure automatically."
    },
    {
      question: "How are columns generated?",
      answer: "Keys from YAML objects are converted into column headers in the CSV output."
    },
    {
      question: "Can I preview the CSV before downloading?",
      answer: "Yes, you can switch between table view and raw CSV output."
    },
    {
      question: "Can I change the delimiter?",
      answer: "Yes, you can customize the separator such as comma, tab, or semicolon."
    },
    {
      question: "Is this YAML to CSV converter free?",
      answer: "Yes, it is completely free with no usage limits."
    },
    {
      question: "Are my files uploaded to a server?",
      answer: "No, all processing happens locally in your browser."
    },
    {
      question: "What happens if my YAML is invalid?",
      answer: "If the YAML cannot be parsed, no CSV output will be generated."
    },
    {
      question: "Who is this tool for?",
      answer: "It's ideal for developers, data engineers, and anyone converting structured config data into tabular format."
    }
  ],

  howItWorks:
    "Paste YAML or upload a file, convert it into a flattened CSV table, preview the result, then download instantly.",

  relatedTools: ["csv-to-yaml", "json-to-csv", "csv-to-json"],
  schemaType: "WebApplication",
  createdAt: "2026-03-30",
  launchedAt: "2026-03-31",
};