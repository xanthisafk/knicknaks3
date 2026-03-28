import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Bill Splitter & Tip Calculator",
  slug: "bill-splitter",
  description: "Split bills, calculate tips, and see per-person totals instantly.",
  category: "calculators",
  icon: "💸",

  keywords: [
    "bill splitter",
    "split bill calculator",
    "tip calculator",
    "restaurant bill splitter",
    "split bill with friends",
    "calculate tip and split bill",
    "gratuity calculator",
    "per person bill calculator",
    "dinner bill calculator",
    "how to split a bill",
    "tip percentage calculator",
    "divide bill evenly",
    "shared expenses calculator",
    "restaurant total calculator"
  ],

  tags: ["finance", "calculator", "money", "split"],

  component: () => import("./BillSplitterTool"),

  capabilities: {
    supportsOffline: true,
  },

  faq: [
    {
      question: "How do I split a bill between multiple people?",
      answer:
        "Enter the total bill, add each person, and assign percentage shares. The calculator automatically determines how much each person owes."
    },
    {
      question: "Can I split the bill unevenly?",
      answer:
        "Yes. You can assign custom percentages to each person, allowing for unequal splits based on what each person ordered."
    },
    {
      question: "How is the tip calculated?",
      answer:
        "You can either choose a percentage of the subtotal or enter a fixed tip amount. The tool calculates the total and distributes it across all participants."
    },
    {
      question: "Does the calculator include tax?",
      answer:
        "Yes. You can enter a tax percentage, which is added to the subtotal before calculating the final total."
    },
    {
      question: "What is a standard tip percentage?",
      answer:
        "In many countries, 15%-20% is standard for good service, though this may vary depending on location and service quality."
    },
    {
      question: "Can I split bills in different currencies?",
      answer:
        "Yes. The tool supports multiple currencies for accurate calculations based on your region."
    },
    {
      question: "How do I split a bill evenly?",
      answer:
        "Use the 'Equal split' option to automatically divide the total equally among all participants."
    },
    {
      question: "Why don't my totals show per person?",
      answer:
        "Per-person totals are only calculated when all shares add up to 100%. Adjust the percentages or use auto-fix to balance them."
    },
    {
      question: "Can I add more people?",
      answer:
        "Yes. You can add multiple participants and adjust their share individually."
    },
    {
      question: "Is this tool free to use?",
      answer:
        "Yes. The calculator is completely free and runs entirely in your browser."
    }
  ],

  howItWorks:
    "Enter your bill subtotal, tax, and tip. Add people and assign their share percentages. The calculator instantly computes the total and how much each person owes.",

  relatedTools: [
    "loan-mortgage-calculator",
    "date-difference-calculator",
    "percentage-calculator"
  ],

  schemaType: "WebApplication",
  createdAt: "2026-03-06",
  updatedAt: "2026-03-28",
};