import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Roman Numeral Converter",
  slug: "roman-numeral",
  description: "Convert numbers to and from Roman neumrals",
  longDescription: "Translate standard Arabic digits into historic Roman numerals automatically. Ideal for academic work, styling copyright dates (e.g., MMXXI), or designing clock faces. Our bidirectional Roman Numeral Converter instantly processes modern integers and validates ancient numeral syntax.",
  category: "converters",
  icon: "🏛️",
  keywords: ["roman numeral converter", "numbers to roman numerals", "roman numerals 1 to 100", "translate roman numerals", "how to write IV IX", "roman numeral year date", "MMXXIV year converter"],
  tags: ["numbers", "conversion"],
  component: () => import("./RomanNumeralTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "What is the maximum number it can translate?", answer: "Standard historic Roman numerals lack a character to signify values of 5,000 or greater without using complex overlines. Therefore, this tool strictly supports the academically acceptable range of 1 to 3,999." },
    { question: "Why does 4 equal IV instead of IIII?", answer: "Classic Roman numbering utilizes a specific subtractive notation to save space. Putting a smaller value (I=1) before a larger value (V=5) indicates subtraction (5-1=4)." },
    { question: "Does it validate my typed Roman numerals?", answer: "Yes. If you attempt to decode an invalid sequence (such as typing 'IIII' or 'VV'), the tool will automatically flag the syntax error rather than guessing a mathematical value." }
  ],
  howItWorks: "Enter any standard integer between 1 and 3999 to see its exact Roman numeral translation. Conversely, toggle the mode and type a valid Roman string (like 'XIV') to instantly reveal its corresponding modern digit value.",
  relatedTools: ["number-to-words", "base-converter"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
