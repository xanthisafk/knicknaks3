import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Percentage Calculator",
  slug: "percentage-calc",
  description: "Perform quick and accurate percentage math for discounts, growth margins, and ratios.",
  longDescription: "Eliminate math errors with our comprehensive Percentage Calculator. Instantly solve everyday percentage problems including finding X% of Y, calculating percentage increase/decrease, resolving reverse percentages, and determining profit margins. Essential for shopping discounts, finance, and academic math.",
  category: "calculators",
  icon: "📊",
  keywords: ["percentage calculator online", "calculate percent increase", "discount price finder", "percent of a number", "margin percentage tool", "growth rate math", "reverse percentage calculator"],
  tags: ["calculator", "math"],
  component: () => import("./PercentageCalcTool"),
  capabilities: { supportsOffline: true },
  faq: [
    { question: "How do I calculate a percentage discount?", answer: "Select the 'Decrease X by Y%' mode. Enter the original price as your first number, and the discount percentage as your second. The tool instantly outputs your final sale price." },
    { question: "What is the formula for percentage increase?", answer: "To find the percentage increase between an old and new value, subtract the old value from the new, divide that result by the old value, and finally multiply by 100. Or, just use the 'Percentage Difference' mode in our tool!" },
    { question: "Does this tool work offline?", answer: "Yes! Once loaded in your browser, the calculator engine runs entirely locally, meaning you can perform complex math equations without an active internet connection." }
  ],
  howItWorks: "Select the specific type of percentage calculation you need from the dropdown menu (e.g., 'What is X% of Y?'). Input your two numerical values into the active fields. The mathematical engine calculates and displays the precise result dynamically as you type.",
  relatedTools: ["gst-calc", "tip-calculator", "unit-converter"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
