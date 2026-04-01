import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "XML to JSON",
  slug: "xml-to-json",
  description: "Convert XML to JSON online",
  category: "converters",
  icon: "🔁",
  keywords: [
    "xml to json",
    "convert xml to json online",
    "xml to json converter free",
    "xml to json parser",
    "xml to json format",
    "xml file to json",
    "transform xml to json",
    "xml to json javascript",
    "data conversion xml json",
    "upload xml convert json"
  ],
  tags: ["data", "conversion", "developer"],

  component: () => import("./XmlToJsonTool"),

  capabilities: {
    supportsOffline: true,
    supportsFileInput: true,
    supportsClipboard: true,
  },

  faq: [
    {
      question: "How do I convert XML to JSON?",
      answer: "Paste your XML or upload a file and it will instantly convert into JSON format."
    },
    {
      question: "Can I upload an XML file?",
      answer: "Yes, you can upload a .xml file and it will be parsed automatically."
    },
    {
      question: "What does the ignore attributes option do?",
      answer: "It removes XML attributes from the output, leaving only element data in the JSON."
    },
    {
      question: "What happens if my XML is invalid?",
      answer: "If the XML cannot be parsed, the tool will show an error and no JSON output will be generated."
    },
    {
      question: "Does it preserve structure?",
      answer: "Yes, XML elements are converted into equivalent JSON objects and arrays."
    },
    {
      question: "Is this XML to JSON converter free?",
      answer: "Yes, it is completely free with no limits."
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
      question: "Can it handle large XML files?",
      answer: "Yes, performance depends on your device, but most modern browsers handle large files well."
    },
    {
      question: "Who is this tool for?",
      answer: "It's ideal for developers, API work, and data transformation tasks."
    }
  ],

  howItWorks:
    "Paste XML or upload a file, convert it into structured JSON, then download instantly.",

  relatedTools: ["json-to-xml", "csv-to-json", "json-to-yaml"],
  schemaType: "WebApplication",
  createdAt: "2026-03-30",
  launchedAt: "2026-04-01",
};
