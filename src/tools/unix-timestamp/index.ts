import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Unix Timestamp Converter",
  slug: "unix-timestamp",
  description: "Convert Unix timestamps to dates and back",
  category: "calculators",
  icon: "⏱️",

  keywords: [
    "unix timestamp converter",
    "epoch converter",
    "timestamp to date",
    "date to unix timestamp",
    "epoch time converter online",
    "seconds to human readable date",
    "milliseconds to date converter",
    "current unix timestamp now",
    "convert timestamp to utc",
    "javascript timestamp converter",
    "online epoch calculator",
    "unix time to iso",
    "timestamp parser tool",
    "epoch milliseconds converter"
  ],

  tags: ["time", "developer", "conversion"],

  component: () => import("./UnixTimestampTool"),

  capabilities: { supportsClipboard: true, supportsOffline: true },

  faq: [
    {
      question: "What is a Unix timestamp?",
      answer:
        "A Unix timestamp is the number of seconds that have passed since January 1, 1970 (UTC). It's a standard format used by operating systems, databases, and APIs to represent time."
    },
    {
      question: "Does this support milliseconds?",
      answer:
        "Yes. The tool automatically detects whether your input is in seconds (10 digits) or milliseconds (13 digits) and converts it correctly."
    },
    {
      question: "Can I convert a date back into a timestamp?",
      answer:
        "Yes. Use the date input to select any date and time, and the tool will instantly generate the corresponding Unix timestamp."
    },
    {
      question: "What time zone is used?",
      answer:
        "All timestamps are based on UTC internally, but the tool displays results in both your local time and UTC for clarity."
    },
    {
      question: "Why are timestamps useful?",
      answer:
        "Timestamps allow systems to store and compare time efficiently using simple numbers, avoiding issues with time zones, formatting, and localization."
    },
    {
      question: "What's the difference between Unix time and ISO 8601?",
      answer:
        "Unix time is a numeric representation (e.g., 1711584000), while ISO 8601 is a human-readable string format (e.g., 2026-03-28T12:00:00Z). This tool converts between both."
    },
    {
      question: "Is the current timestamp updated live?",
      answer:
        "Yes. The tool continuously updates the current Unix timestamp in real time so you always have an accurate reference."
    }
  ],

  howItWorks:
    "Enter a Unix timestamp to convert it into readable date formats, or pick a date to generate its timestamp. The tool auto-detects seconds vs milliseconds and shows UTC, local time, ISO format, and relative time instantly.",

  relatedTools: ["date-difference-calculator", "time-duration", "timezone-converter"],

  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-28",
};
