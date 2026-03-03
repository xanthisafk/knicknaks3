import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Number to Words",
  slug: "number-to-words",
  description: "Instantly spell out numbers into written English text. Perfect for legal documents and writing checks.",
  longDescription: "Avoid formatting mistakes on important paperwork. The Number to Words converter instantly transcribes any numerical digit string (e.g., '1542') into its fully spelled-out English equivalent ('one thousand five hundred forty-two'). Seamlessly supports decimal points and features a dedicated currency mode for writing formal checks.",
  category: "converters",
  icon: "🔤",
  keywords: ["number to words converter", "spell out numbers english", "write a check helper", "digits to text format", "legal document number spelling", "currency format words", "spell long numbers"],
  tags: ["numbers", "text", "conversion"],
  component: () => import("./NumberToWordsTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "Does this tool support decimals?", answer: "Yes. Regular decimals are explicitly written out as 'point [number]', while enabling Currency Mode formats fractions formally as 'and [X]/100' (e.g., an exact format used for writing bank checks)." },
    { question: "How large of a number can it convert?", answer: "The underlying algorithm is optimized to reliably spelled out massive numbers up to one quadrillion (10^15)." },
    { question: "Does it capitalize the output text?", answer: "By default, the conversion outputs standard lowercase words. You can pair this output with our Case Converter tool to instantly apply Title Case or UPPERCASE as needed." }
  ],
  howItWorks: "Type any series of raw digits into the input field. The software instantly parses the numerical value and outputs the completely written English phrase. Check the 'Currency Mode' toggle to format the output specifically for banking documents.",
  relatedTools: ["word-to-number", "percentage-calc"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
