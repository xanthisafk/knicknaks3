import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Timezone Converter",
  slug: "timezone-converter",
  description: "Convert time between time zones instantly with live world clock.",
  category: "calculators",
  icon: "🌍",

  keywords: [
    "timezone converter",
    "time zone converter",
    "world clock",
    "convert time zones",
    "international time converter",
    "meeting time planner",
    "global time converter",
    "time difference between cities",
    "utc converter",
    "gmt converter",
    "current time worldwide",
    "schedule across time zones",
    "time zone calculator"
  ],

  tags: ["time", "calculator", "timezone", "world clock"],

  component: () => import("./TimezoneConverterTool"),

  capabilities: {
    supportsOffline: true,
  },

  faq: [
    {
      question: "Does this timezone converter handle daylight saving time (DST)?",
      answer:
        "Yes. All conversions automatically account for daylight saving time based on the selected location and date."
    },
    {
      question: "Can I compare multiple timezones at once?",
      answer:
        "Yes. The tool displays multiple timezones simultaneously so you can quickly compare global times."
    },
    {
      question: "What is the best way to schedule meetings across time zones?",
      answer:
        "Use a reference timezone and compare others side-by-side to find overlapping working hours across regions."
    },
    {
      question: "Does this tool work offline?",
      answer:
        "Yes. All calculations run in your browser using built-in time APIs."
    },
    {
      question: "Can I see the current time worldwide?",
      answer:
        "Yes. Enable live mode to view real-time updates across all selected timezones."
    },
    {
      question: "What is UTC and why is it important?",
      answer:
        "UTC (Coordinated Universal Time) is the global time standard used to synchronize clocks worldwide."
    },
    {
      question: "Why do some cities have different offsets during the year?",
      answer:
        "This is due to daylight saving time changes, which shift clocks forward or backward seasonally."
    },
    {
      question: "Can I search and filter timezones?",
      answer:
        "Yes. Use the search input to quickly find cities or regions by name or timezone ID."
    },
    {
      question: "How accurate are the time conversions?",
      answer:
        "The tool uses the browser's Intl API, which relies on up-to-date timezone databases for accurate conversions."
    },
    {
      question: "What is the difference between GMT and UTC?",
      answer:
        "GMT is a time zone, while UTC is a time standard. In practice, they are often used interchangeably."
    }
  ],

  howItWorks:
    "Select a source time and timezone, then instantly view equivalent times across multiple global locations. Live mode shows real-time updates.",

  relatedTools: [
    "date-difference-calculator",
    "age-calculator",
    "cron-parser",
    "unix-timestamp-converter"
  ],

  schemaType: "WebApplication",
  createdAt: "2026-03-06",
  launchedAt: "2026-03-06",
  updatedAt: "2026-03-27",
};