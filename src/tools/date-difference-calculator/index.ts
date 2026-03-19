import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Date Difference Calculator",
  slug: "date-difference-calculator",
  description:
    "Calculate the exact difference between two dates",
  category: "calculators",
  icon: "📅",

  keywords: [
    "date difference calculator",
    "days between dates",
    "date duration calculator",
    "calculate days between dates",
    "time between two dates",
    "date interval calculator"
  ],

  tags: ["date", "calculator"],

  component: () => import("./DateDifferenceCalculatorTool"),

  capabilities: {
    supportsOffline: true,
  },

  faq: [
    {
      question: "Can I calculate months or years between dates?",
      answer:
        "Yes. The calculator shows the exact difference in days, weeks, months, and years."
    },
    {
      question: "Does it account for leap years?",
      answer:
        "Yes. The calculation automatically accounts for leap years and varying month lengths."
    }
  ],

  howItWorks:
    "Select a start date and an end date. The tool instantly calculates the total difference between them in multiple time units.",

  relatedTools: ["timezone-converter", "loan-mortgage-calculator"],
  schemaType: "WebApplication",
  createdAt: "2026-03-06",
  launchedAt: "2026-03-06",
  lastUpdated: "2026-03-19",
};