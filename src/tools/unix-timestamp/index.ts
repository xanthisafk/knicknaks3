import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Unix Timestamp Converter",
  slug: "unix-timestamp",
  description: "Convert between Unix timestamps and human-readable dates with live clock display.",
  category: "calculators",
  icon: "⏱️",
  keywords: ["unix", "timestamp", "epoch", "date", "time", "convert", "iso", "utc"],
  tags: ["time", "conversion", "developer"],

  component: () => import("./UnixTimestampTool"),

  capabilities: { supportsClipboard: true, supportsOffline: true },

  faq: [
    {
      question: "What is a Unix timestamp?",
      answer: "A Unix timestamp (epoch time) is the number of seconds since January 1, 1970 00:00:00 UTC. It's widely used in computing for representing dates.",
    },
  ],

  howItWorks: "Enter a Unix timestamp to see the human-readable date, or pick a date to get its timestamp. The live clock shows the current epoch time.",
  relatedTools: ["age-calculator", "time-duration"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
