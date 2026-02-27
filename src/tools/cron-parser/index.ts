import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Cron Expression Parser",
  slug: "cron-parser",
  description: "Translate cron expressions into plain English and preview the next scheduled run times.",
  category: "dev",
  icon: "⏰",
  keywords: ["cron", "schedule", "expression", "parser", "job", "task", "linux", "server", "time"],
  tags: ["developer", "scheduling"],
  component: () => import("./CronParserTool"),
  capabilities: { supportsOffline: true },
  faq: [
    { question: "What format does it support?", answer: "Standard 5-field cron (minute, hour, day, month, weekday) and 6-field with seconds." },
    { question: "What does * mean?", answer: "An asterisk means 'every' — e.g. * in the minute field means 'every minute'." },
  ],
  howItWorks: "Enter a cron expression to see a human-readable description and the next 5 scheduled execution times.",
  relatedTools: ["unix-timestamp", "time-duration"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-27",
};
