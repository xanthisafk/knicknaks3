import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Roman Numeral Converter",
  slug: "roman-numeral",
  description: "Convert between integers and Roman numerals (I–MMMCMXCIX) with validation.",
  category: "converters",
  icon: "🏛️",
  keywords: ["roman", "numeral", "convert", "integer", "number", "IV", "IX", "classic"],
  tags: ["numbers", "conversion"],
  component: () => import("./RomanNumeralTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "What range is supported?", answer: "1 to 3999 — the traditional range of Roman numerals." },
    { question: "What does IV mean?", answer: "IV = 4. Roman numerals use subtraction when a smaller value precedes a larger one." },
  ],
  howItWorks: "Enter an integer to get the Roman numeral, or type Roman numerals to get the integer value.",
  relatedTools: ["number-to-words", "base-converter"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
