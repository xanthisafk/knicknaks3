import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Number to Words",
  slug: "number-to-words",
  description:
    "Convert numbers into words across 30+ currencies and global locales — with accurate regional formats and language support",
  category: "converters",
  icon: "🔤",
  keywords: [
    "number to words converter",
    "spell out numbers",
    "write a check helper",
    "digits to text format",
    "legal document number spelling",
    "currency in words",
    "amount in words for invoice",
    "cheque amount words",
    "number spelling multiple languages",
    "multilingual number converter",
    "international number formats",
    "localized currency words",
  ],
  tags: ["numbers", "text", "conversion", "currency", "locale"],
  component: () => import("./NumberToWordsTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    {
      question: "Does this support different regional numbering systems?",
      answer:
        "Yes. The tool automatically applies the correct numbering system based on the selected locale — including Western (thousand/million), Indian (lakh/crore), and other region-specific formats.",
    },
    {
      question: "Which currencies and languages are supported?",
      answer:
        "30+ currencies across their native locales: US Dollar (en-US), Euro (various EU locales), Japanese Yen (ja-JP), Chinese Yuan (zh-CN), Korean Won (ko-KR), Brazilian Real (pt-BR), Russian Ruble (ru-RU), Arabic currencies (ar-SA, ar-AE), Indian Rupee (en-IN), and more — all using correct regional conventions and subunits.",
    },
    {
      question: "Does it handle decimal numbers?",
      answer:
        "Yes. In plain words mode, decimals are written as 'point [number]'. In currency mode, the fractional part is expressed using the appropriate subunit for the selected currency — such as cents, pence, paise, or similar.",
    },
    {
      question: "How large a number can it convert?",
      answer:
        "Up to 999 trillion (10^15), with support for large-number naming conventions across supported locales.",
    },
  ],
  howItWorks:
    "Select a currency or locale, then enter a number. The tool instantly converts it into words using the correct regional numbering system, language rules, and currency subunits for that selection.",
  relatedTools: ["word-to-number", "percentage-calc"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  lastUpdated: "2026-03-21",
};