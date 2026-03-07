import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Tip Calculator",
  slug: "tip-calculator",
  description: "Calculate tips and split restaurant bills between multiple people",

  longDescription:
    "Easily calculate restaurant tips and split bills with friends using this fast tip calculator. Enter the bill amount, choose a tip percentage, and instantly see the total including tip and the exact amount each person should pay. " +
    "Perfect for dining out, group meals, or travel expenses where you need quick and fair bill splitting.",

  category: "calculators",
  status: "alpha",
  icon: "💰",

  keywords: [
    "tip calculator",
    "restaurant tip calculator",
    "split bill calculator",
    "tip percentage calculator",
    "bill splitter",
    "calculate tip online",
    "gratuity calculator"
  ],

  tags: ["finance", "calculator"],

  component: () => import("./TipCalculatorTool"),

  capabilities: {
    supportsOffline: true,
  },

  faq: [
    {
      question: "How do I calculate a tip?",
      answer:
        "Enter the bill amount and select a tip percentage. The calculator automatically computes the tip amount, the total bill including tip, and how much each person should pay."
    },
    {
      question: "Can I split the bill between multiple people?",
      answer:
        "Yes. Simply enter the number of people sharing the bill and the calculator will display the exact per-person amount."
    }
  ],

  howItWorks:
    "Enter the total bill amount, choose a tip percentage, and specify how many people are sharing the bill. The calculator instantly shows the tip amount, total bill, and individual payment amounts.",

  relatedTools: ["loan-mortgage-calculator", "date-difference-calculator"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-06",
};