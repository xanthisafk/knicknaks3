import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Timezone Converter",
  slug: "timezone-converter",
  description: "Convert times across multiple timezones",
  longDescription:
    "Easily convert times between different timezones with automatic daylight saving awareness. Perfect for scheduling meetings, planning international calls, or coordinating remote teams across different regions.",

  category: "calculators",
  status: "alpha",
  icon: "🌍",

  keywords: [
    "timezone converter",
    "time zone converter",
    "convert time between timezones",
    "world clock converter",
    "international time converter",
    "meeting time planner"
  ],

  tags: ["time", "calculator"],

  component: () => import("./TimezoneConverterTool"),

  capabilities: {
    supportsOffline: true,
  },

  faq: [
    {
      question: "Does this tool account for daylight saving time?",
      answer:
        "Yes. The converter automatically adjusts times based on current daylight saving rules for each timezone."
    },
    {
      question: "Can I compare multiple timezones at once?",
      answer:
        "Yes. You can view the same time across several global timezones simultaneously."
    }
  ],

  howItWorks:
    "Enter a date and time in one timezone, then select additional timezones to see the equivalent times instantly.",

  relatedTools: ["date-difference-calculator"],
  schemaType: "WebApplication",
  updatedAt: "2026-03-06",
};