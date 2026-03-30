import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Word to Number",
  slug: "word-to-number",
  description: "Convert number words to digits instantly. Supports decimals, large numbers, and formats.",
  category: "converters",
  icon: "🔢",
  keywords: [
    "word to number converter",
    "convert words to numbers",
    "text to number converter",
    "number words to digits",
    "english words to number",
    "spell number to digit",
    "written number converter",
    "convert text to integer",
    "decimal words to number",
    "large number word converter"
  ],
  tags: ["text", "numbers", "conversion"],

  component: () => import("./WordToNumberTool"),

  capabilities: { supportsOffline: true, supportsClipboard: true },

  faq: [
    {
      question: "How do I convert words to numbers?",
      answer: "Type or paste number words like 'one hundred twenty three' and the tool instantly converts them into digits."
    },
    {
      question: "Can it convert large numbers?",
      answer: "Yes, it supports large values including millions, billions, trillions, and regional formats like lakh and crore."
    },
    {
      question: "Does it support decimal numbers?",
      answer: "Yes, phrases like 'three point five' are converted into 3.5 automatically."
    },
    {
      question: "Can I enter negative numbers?",
      answer: "Yes, using words like 'minus' or 'negative' will produce negative values."
    },
    {
      question: "Does it handle different number systems?",
      answer: "Yes, both Western (million, billion) and Indian (lakh, crore) systems are supported."
    },
    {
      question: "Do I need perfect grammar or formatting?",
      answer: "No, the parser handles variations like hyphens, spacing, and optional words like 'and'."
    },
    {
      question: "Is this word to number converter free?",
      answer: "Yes, it is completely free with no usage limits."
    },
    {
      question: "Is my input data stored?",
      answer: "No, your input is not stored or sent anywhere."
    },
    {
      question: "What happens if the input is invalid?",
      answer: "If the text cannot be parsed into a number, the tool will return an empty result."
    }
  ],

  howItWorks:
    "Enter number words like 'two thousand five hundred' and instantly convert them into digits, including decimals and large values.",

  relatedTools: ["number-to-words", "percentage-calc"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-30",
};