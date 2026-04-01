import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "JSON to YAML",
  slug: "json-to-yaml",
  description: "Convert JSON to YAML online",
  category: "converters",
  icon: "🔁",
  keywords: [
    "json to yaml",
    "convert json to yaml online",
    "json to yaml converter free",
    "json to yaml parser",
    "json to yaml format",
    "json file to yaml",
    "transform json to yaml",
    "json to yaml javascript",
    "data conversion json yaml",
    "upload json convert yaml"
  ],
  tags: ["data", "conversion", "developer"],

  component: () => import("./JsonToYamlTool"),

  capabilities: {
    supportsOffline: true,
    supportsFileInput: true,
    supportsClipboard: true,
  },

  faq: [
    {
      question: "How do I convert JSON to YAML?",
      answer: "Paste your JSON or upload a file and it will instantly convert into YAML format."
    },
    {
      question: "Can I upload a JSON file?",
      answer: "Yes, you can upload a .json file and it will be converted automatically."
    },
    {
      question: "What is YAML used for?",
      answer: "YAML is commonly used for configuration files, DevOps workflows, and data serialization."
    },
    {
      question: "Does it preserve structure?",
      answer: "Yes, the JSON hierarchy is converted into equivalent YAML structure."
    },
    {
      question: "Is this JSON to YAML converter free?",
      answer: "Yes, it is completely free with no usage limits."
    },
    {
      question: "Are my files uploaded to a server?",
      answer: "No, all processing happens locally in your browser."
    },
    {
      question: "Can I download the YAML file?",
      answer: "Yes, you can download the converted YAML with a custom filename."
    },
    {
      question: "What happens if my JSON is invalid?",
      answer: "If the JSON cannot be parsed, no YAML output will be generated."
    },
    {
      question: "Does it support large files?",
      answer: "Yes, performance depends on your device, but most modern browsers handle large inputs well."
    },
    {
      question: "Who is this tool for?",
      answer: "It's ideal for developers, DevOps engineers, and data transformation tasks."
    }
  ],

  howItWorks:
    "Paste JSON or upload a file, convert it into YAML format instantly, then download the result.",

  relatedTools: ["yaml-to-json", "json-to-toml", "csv-to-json"],
  schemaType: "WebApplication",
  createdAt: "2026-03-30",
  launchedAt: "2026-04-01",
};