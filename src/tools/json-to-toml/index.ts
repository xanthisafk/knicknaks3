import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "JSON to TOML",
  slug: "json-to-toml",
  description: "Convert JSON to TOML online",
  category: "converters",
  icon: "🔁",
  keywords: [
    "json to toml",
    "convert json to toml online",
    "json to toml converter free",
    "json to toml config",
    "json to toml parser",
    "json to toml file",
    "convert json to toml format",
    "json to toml javascript",
    "config converter json to toml",
    "upload json convert toml"
  ],
  tags: ["data", "conversion", "developer"],

  component: () => import("./JsonToTomlTool"),

  capabilities: {
    supportsOffline: true,
    supportsFileInput: true,
    supportsClipboard: true,
  },

  faq: [
    {
      question: "How do I convert JSON to TOML?",
      answer: "Paste your JSON or upload a file and it will instantly convert into TOML format."
    },
    {
      question: "Can I upload a JSON file?",
      answer: "Yes, you can upload a .json file and it will be converted automatically."
    },
    {
      question: "Does it support JSON arrays?",
      answer: "Yes, arrays are automatically wrapped into a valid TOML structure for compatibility."
    },
    {
      question: "What is TOML used for?",
      answer: "TOML is commonly used for configuration files in tools like Rust, Python, and modern dev environments."
    },
    {
      question: "Is this JSON to TOML converter free?",
      answer: "Yes, it is completely free with no limits."
    },
    {
      question: "Are my files uploaded to a server?",
      answer: "No, all processing happens locally in your browser."
    },
    {
      question: "Can I download the TOML file?",
      answer: "Yes, you can download the converted file with a custom filename."
    },
    {
      question: "What happens if my JSON is invalid?",
      answer: "If the JSON cannot be parsed, no TOML output will be generated."
    },
    {
      question: "Does it preserve data types?",
      answer: "Yes, numbers, booleans, and strings are preserved during conversion."
    },
    {
      question: "Who is this tool for?",
      answer: "It's ideal for developers converting JSON configs into TOML for tools and applications."
    }
  ],

  howItWorks:
    "Paste JSON or upload a file, convert it into TOML format instantly, then download the result.",

  relatedTools: ["toml-to-json", "json-to-yaml", "csv-to-json"],
  schemaType: "WebApplication",
  createdAt: "2026-03-30",
  launchedAt: "2026-04-01",
};