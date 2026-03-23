import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Percentage Calculator",
  slug: "percentage-calc",
  description: "Quickly compute percentages, changes, and value adjustments",
  category: "calculators",
  icon: "📊",
  keywords: [
    "percentage calculator",
    "percent increase decrease",
    "percent change formula",
    "what is x percent of y",
    "percentage difference",
    "discount calculator",
    "markup and markdown calculator"
  ],
  tags: ["calculator", "math", "percentage"],
  component: () => import("./PercentageCalcTool"),
  capabilities: { supportsOffline: true },
  faq: [
    {
      question: "How do I calculate a percentage discount?",
      answer: "Use the 'Increase / Decrease X by Y%' section. Enter the original value and the percentage to instantly see the reduced amount."
    },
    {
      question: "What is the formula for percentage change?",
      answer: "((new value - original value) / original value) x 100. The tool calculates this automatically in the '% Change from X to Y' section."
    },
    {
      question: "Can I use this without internet?",
      answer: "Yes. Once loaded, all calculations run locally in your browser."
    }
  ],
  howItWorks: "Enter values into any section (percent of, ratio, change, or adjustment). Results update instantly as you type, with no manual calculation required.",
  relatedTools: ["gst-calc", "tip-calculator", "unit-converter"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-23",
};