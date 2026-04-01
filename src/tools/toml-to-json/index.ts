import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "TOML to JSON",
  slug: "toml-to-json",
  description: "Convert TOML to JSON online free. Fast, secure, and runs in your browser.",
  category: "converters",
  icon: "🔁",
  keywords: [
    "toml to json",
    "convert toml to json online",
    "toml to json converter free",
    "toml parser to json",
    "toml to json format",
    "toml file to json",
    "config toml to json",
    "toml to json javascript",
    "data conversion toml json",
    "upload toml convert json"
  ],
  tags: ["data", "conversion", "developer"],

  component: () => import("./TomlToJsonTool"),

  capabilities: {
    supportsOffline: true,
    supportsFileInput: true,
    supportsClipboard: true,
  },

  faq: [
    {
      question: "How do I convert TOML to JSON?",
      answer: "Paste your TOML or upload a file and it will instantly convert into JSON format."
    },
    {
      question: "Can I upload a TOML file?",
      answer: "Yes, you can upload a .toml file and it will be parsed automatically."
    },
    {
      question: "What happens if my TOML is invalid?",
      answer: "If the TOML cannot be parsed, the tool will show an error and no JSON output will be generated."
    },
    {
      question: "Does it preserve data types?",
      answer: "Yes, numbers, booleans, arrays, and objects are preserved in the JSON output."
    },
    {
      question: "Is this TOML to JSON converter free?",
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
      question: "What is TOML used for?",
      answer: "TOML is commonly used for configuration files in tools like Rust, Python, and modern development environments."
    },
    {
      question: "Is formatting preserved?",
      answer: "The output is formatted as readable, indented JSON for easy use."
    },
    {
      question: "Who is this tool for?",
      answer: "It's ideal for developers working with config files and data transformation."
    }
  ],

  howItWorks:
    "Paste TOML or upload a file, convert it into JSON format instantly, then download the result.",

  relatedTools: ["json-to-toml", "json-to-yaml", "csv-to-json"],
  schemaType: "WebApplication",
  createdAt: "2026-03-30",
  launchedAt: "2026-04-01",
};