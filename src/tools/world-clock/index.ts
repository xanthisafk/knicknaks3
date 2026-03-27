import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "World Clock",
  slug: "world-clock",
  description: "View current time worldwide with a live global clock.",
  category: "calculators",
  icon: "🌏",

  keywords: [
    "world clock",
    "current time worldwide",
    "global clock",
    "time around the world",
    "international clock",
    "live world time",
    "time in different countries",
    "current time in cities",
    "world time lookup",
    "timezone clock",
    "real time global clock",
    "what time is it in"
  ],

  tags: ["time", "clock", "timezone", "world"],

  component: () => import("./WorldClockTool"),

  capabilities: {
    supportsOffline: true,
  },

  faq: [
    {
      question: "How does the world clock work?",
      answer:
        "It uses your browser's system time and the Intl API to display accurate local times across global timezones in real time."
    },
    {
      question: "Is the time updated live?",
      answer:
        "Yes. The clock updates every second to reflect the current time worldwide."
    },
    {
      question: "Does it adjust for daylight saving time?",
      answer:
        "Yes. All displayed times automatically reflect daylight saving changes based on each region."
    },
    {
      question: "Can I search for specific cities?",
      answer:
        "Yes. Use the search bar to quickly filter and find cities or timezones."
    },
    {
      question: "Does this tool work offline?",
      answer:
        "Yes. It runs entirely in your browser without requiring an internet connection."
    },
    {
      question: "What is UTC and how is it used?",
      answer:
        "UTC is the global time standard used to coordinate time worldwide. All timezones are offsets from UTC."
    },
    {
      question: "Why do some locations have unusual offsets like +5:30?",
      answer:
        "Some countries use half-hour or unusual offsets instead of full hours due to historical and regional decisions."
    }
  ],

  howItWorks:
    "The tool continuously updates the current time using your device clock and converts it across global timezones using built-in browser APIs.",

  relatedTools: [
    "timezone-converter",
    "date-difference-calculator",
    "unix-timestamp-converter"
  ],

  schemaType: "WebApplication",
  createdAt: "2026-03-27",
  launchedAt: "2026-03-27",
  updatedAt: "2026-03-27",
};
