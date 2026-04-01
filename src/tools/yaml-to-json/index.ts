import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "YAML to JSON",
  slug: "yaml-to-json",
  description: "Convert YAML to JSON online",
  category: "converters",
  icon: "🔁",
  keywords: [
    "yaml to json",
    "convert yaml to json online",
    "yaml to json converter free",
    "yaml to json parser",
    "yaml file to json",
    "transform yaml to json",
    "yaml to json format",
    "yaml to json javascript",
    "data conversion yaml json",
    "upload yaml convert json"
  ],
  tags: ["data", "conversion", "developer"],

  component: () => import("./YamlToJsonTool"),

  capabilities: {
    supportsOffline: true,
    supportsFileInput: true,
    supportsClipboard: true,
  },

  faq: [
    {
      question: "How do I convert YAML to JSON?",
      answer: "Paste your YAML or upload a file and it will instantly convert into JSON format."
    },
    {
      question: "Can I upload a YAML file?",
      answer: "Yes, you can upload .yaml or .yml files and convert them automatically."
    },
    {
      question: "What happens if my YAML is invalid?",
      answer: "If the YAML cannot be parsed, the tool will show an error and no JSON output will be generated."
    },
    {
      question: "Does it preserve data structure?",
      answer: "Yes, nested YAML structures are converted into equivalent JSON objects and arrays."
    },
    {
      question: "Is this YAML to JSON converter free?",
      answer: "Yes, it is completely free with no usage limits."
    },
    {
      question: "Are my files uploaded to a server?",
      answer: "No, all processing happens locally in your browser."
    },
    {
      question: "Can I download the JSON file?",
      answer: "Yes, you can download the converted JSON with a custom filename."
    },
    {
      question: "What is YAML commonly used for?",
      answer: "YAML is widely used for configuration files, DevOps pipelines, and data serialization."
    },
    {
      question: "Does it support large files?",
      answer: "Yes, performance depends on your device, but most modern browsers handle large inputs well."
    },
    {
      question: "Who is this tool for?",
      answer: "It's ideal for developers, DevOps engineers, and data transformation workflows."
    }
  ],

  howItWorks:
    "Paste YAML or upload a file, convert it into JSON format instantly, then download the result.",

  relatedTools: ["json-to-yaml", "json-to-toml", "csv-to-json"],
  schemaType: "WebApplication",
  createdAt: "2026-03-30",
  launchedAt: "2026-04-01",
};
