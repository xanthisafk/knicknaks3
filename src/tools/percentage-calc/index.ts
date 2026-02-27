import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Percentage Calculator",
  slug: "percentage-calc",
  description: "Quick percentage calculations for growth, margins, discounts, and more.",
  category: "calculators",
  icon: "📊",
  keywords: ["percentage", "percent", "calculate", "growth", "margin", "discount", "ratio"],
  tags: ["calculator", "math"],
  component: () => import("./PercentageCalcTool"),
  capabilities: { supportsOffline: true },
  howItWorks: "Choose a calculation mode and enter values. Results update in real-time.",
  relatedTools: ["gst-calc", "tip-calculator", "unit-converter"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
