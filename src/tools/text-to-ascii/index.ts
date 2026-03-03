import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text ↔ ASCII Codes",
  slug: "text-to-ascii",
  description: "Instantly translate text characters to their decimal ASCII or Unicode code point values and back.",
  longDescription: "Dive into the fundamental mathematical representation of typography. Our bidirectional Text-to-ASCII tool instantly maps standard alphabetical strings into their underlying decimal numerical codes. It effectively supports the classic 128-character ASCII table, but extends seamlessly into full Unicode map points (supporting complex symbols and emojis).",
  category: "encoders",
  icon: "🔤",
  keywords: ["text to ascii converter", "ascii code translator", "unicode code point finder", "decimal string encoder", "ascii values of letters", "decode ascii string", "char code converter"],
  tags: ["encoding", "developer"],
  component: () => import("./TextToAsciiTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "What is the difference between ASCII and Unicode here?", answer: "The classic ASCII standard only covers basic characters numbered 0–127 (like 'A' which is 65). This tool actually uses Modern Javascript, which renders the full Unicode standard, allowing it to accurately generate decimal codes for emojis and foreign characters." },
    { question: "What separator is used for the output?", answer: "By default, the tool outputs a clean, space-separated sequence of decimal numbers to ensure readability. You can change this format in the options if needed." },
    { question: "How do I decode numbers back to text?", answer: "Simply toggle the tool to 'Decode', and paste your space-separated list of numerical digits. Assuming they are valid unicode points, the english text will immediately appear." }
  ],
  howItWorks: "Enter standard text into the box to see its raw numerical representation updated live. To reverse the process, change the mode and enter a sequence of delimited digits to spawn the corresponding textual characters.",
  relatedTools: ["text-to-hex", "unicode-inspector"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
