import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Roman Numeral Converter",
  slug: "roman-numeral",
  description: "Convert numbers to Roman numerals and Roman numerals to numbers.",
  category: "converters",
  icon: "🏛️",
  keywords: [
    "roman numeral converter",
    "number to roman numerals",
    "roman numerals to numbers",
    "convert roman numerals",
    "roman numeral translator",
    "roman numerals chart",
    "roman numeral calculator",
    "convert year to roman numerals",
    "MMXXIV meaning",
    "roman number converter"
  ],
  tags: ["numbers", "conversion", "calculator"],
  component: () => import("./RomanNumeralTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    {
      question: "What numbers are supported?",
      answer: "The tool supports standard Roman numerals from 1 to 3999."
    },
    {
      question: "How are Roman numerals calculated?",
      answer: "Roman numerals use additive and subtractive notation, such as IV for 4 and IX for 9."
    },
    {
      question: "Can I convert Roman numerals back to numbers?",
      answer: "Yes, you can instantly convert valid Roman numerals into their numeric values."
    }
  ],
  howItWorks: "Enter a number or Roman numeral to instantly convert between formats in real time.",
  relatedTools: ["number-to-words", "base-converter"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-24",
};