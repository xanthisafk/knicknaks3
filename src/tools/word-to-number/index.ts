import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Word to Number",
  slug: "word-to-number",
  description: "Convert words to numbers and numbers to words",
  longDescription: "Effortlessly bridge the gap between mathematics and linguistics. Our bidirectional Word-to-Number translator takes written phrases (like 'three hundred forty two') and mathematically converts them into integers ('342'), and vice versa. Perfect for data entry normalization, students learning English numerical grammar, and programming string manipulation.",
  category: "converters",
  icon: "🔢",
  keywords: ["word to number converter", "numbers to words online", "spell out number", "english number translation", "digit to text generator", "written number decoder", "convert text to integer"],
  tags: ["text", "numbers", "conversion"],
  component: () => import("./WordToNumberTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "What is the maximum number it can convert?", answer: "The parsing engine is incredibly robust, successfully translating digits into the trillions (both positive and negative) in both text-to-number and number-to-text directions." },
    { question: "Does it understand decimal points?", answer: "Yes! Writing a phrase like 'three point five' will successfully translate to '3.5', while inserting fractional digits will reverse out into properly spaced english words." },
    { question: "Does it require grammar to be perfect?", answer: "Not entirely. The linguistic parser is forgiving with hyphens, capitalizations, and conjunctions (e.g. 'one hundred AND twenty' works identically to 'one hundred twenty')." }
  ],
  howItWorks: "Type either a standard digit (e.g., '1024') or a written phrase (e.g., 'one thousand twenty-four') into the input field. The tool continuously evaluates the string type, simultaneously translating it into its exact structural opposite.",
  relatedTools: ["number-to-words", "percentage-calc"],
  schemaType: "WebApplication",
  updatedAt: "2026-03-03",
};
