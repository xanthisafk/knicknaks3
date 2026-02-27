import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Age Calculator",
  slug: "age-calculator",
  description: "Calculate precise age between two dates in years, months, and days.",
  category: "calculators",
  icon: "🎂",
  keywords: ["age", "calculator", "date", "birthday", "years", "months", "days", "difference"],
  tags: ["calculator", "date"],
  component: () => import("./AgeCalculatorTool"),
  capabilities: { supportsOffline: true },
  howItWorks: "Enter your birth date (and optionally a target date). The calculator shows your exact age in years, months, days, and bonus stats.",
  relatedTools: ["unix-timestamp", "time-duration", "percentage-calc"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
