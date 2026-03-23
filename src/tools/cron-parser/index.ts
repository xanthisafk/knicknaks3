import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Cron Expression Parser",
  slug: "cron-parser",
  description: "Translate complex cron expressions into human-readable time",
  category: "dev",
  icon: "⏰",
  keywords: ["cron parser", "cron expression reader", "cron to english", "crontab calculator", "cron schedule explainer", "linux task scheduling", "next cron run time previewer"],
  tags: ["developer", "scheduling"],
  component: () => import("./CronParserTool"),
  capabilities: { supportsOffline: true },
  faq: [
    { question: "What cron formats are supported?", answer: "We support standard 5-field cron formats typical of Unix/Linux systems (minute, hour, day of month, month, day of week), as well as modern 6-field formats that include a leading 'seconds' field." },
    { question: "What does the asterisk (*) operator mean?", answer: "The asterisk operator acts as a wildcard meaning 'every'. For instance, an asterisk in the minute field means the job will run 'every single minute'." },
    { question: "Does the parser support step or range values?", answer: "Yes! You can seamlessly parse step values (e.g., `*/15` for every 15 minutes), ranges (`1-5`), and lists (`1,3,5`)." }
  ],
  howItWorks: "Type your raw cron expression (like `0 12 * * 1-5`) into the input field. The parser instantly tokenizes the string, generating a human-readable descriptive sentence alongside a list of the exact next 5 chronological execution timestamps.",
  relatedTools: ["unix-timestamp", "time-duration"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-18",
};
