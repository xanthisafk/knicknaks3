import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Time Until Calculator",
  slug: "time-until-calculator",
  description: "Calculate time until a date with custom hour support",
  category: "calculators",
  icon: "🕙",
  keywords: ["time untill"],

  component: () => import("./TimeUntilCalculatorTool"),

  capabilities: {
    supportsOffline: true,
  },

  createdAt: "2026-04-08",
};
