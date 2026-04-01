import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "JSON to XML",
  slug: "json-to-xml",
  description: "Convert JSON to XML online",
  category: "converters",
  icon: "🔁",
  keywords: [
    "json to xml",
    "convert json to xml online",
    "json to xml converter free",
    "json to xml parser",
    "json to xml format",
    "json to xml javascript",
    "json file to xml",
    "transform json to xml",
    "data conversion json xml",
    "upload json convert xml"
  ],
  tags: ["data", "conversion", "developer"],

  component: () => import("./JsonToXmlTool"),

  capabilities: {
    supportsOffline: true,
    supportsFileInput: true,
    supportsClipboard: true,
  },

  faq: [
    {
      question: "How do I convert JSON to XML?",
      answer: "Paste your JSON or upload a file and it will instantly convert into XML format."
    },
    {
      question: "Can I upload a JSON file?",
      answer: "Yes, you can upload a .json file and convert it automatically."
    },
    {
      question: "How are arrays handled in XML?",
      answer: "Arrays are wrapped into a root structure so they can be represented correctly in XML."
    },
    {
      question: "What does the ignore attributes option do?",
      answer: "It controls whether special attribute-style keys are included or skipped in the XML output."
    },
    {
      question: "Is this JSON to XML converter free?",
      answer: "Yes, it is completely free with no usage limits."
    },
    {
      question: "Are my files uploaded to a server?",
      answer: "No, all processing happens locally in your browser."
    },
    {
      question: "Can I download the XML file?",
      answer: "Yes, you can download the converted XML with a custom filename."
    },
    {
      question: "What happens if my JSON is invalid?",
      answer: "If the JSON cannot be parsed, no XML output will be generated."
    },
    {
      question: "Does it preserve structure?",
      answer: "Yes, the JSON hierarchy is converted into equivalent XML elements."
    },
    {
      question: "Who is this tool for?",
      answer: "It's useful for developers, APIs, and data transformation workflows."
    }
  ],

  howItWorks:
    "Paste JSON or upload a file, convert it into structured XML, then download instantly.",

  relatedTools: ["xml-to-json", "json-to-yaml", "csv-to-json"],
  schemaType: "WebApplication",
  createdAt: "2026-03-30",
  launchedAt: "2026-04-01",
};