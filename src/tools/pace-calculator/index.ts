import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Pace Calculator",
  slug: "pace-calculator",
  description: "Calculate your running pace, time, or distance for training and races.",
  category: "health",
  icon: "🏃",
  keywords: ["pace", "running", "marathon", "distance", "time", "speed", "calculator"],
  tags: ["calculator", "health", "sports"],
  component: () => import("./PaceCalculatorTool"),
  capabilities: { supportsOffline: true },
  howItWorks: "Enter two of the three variables (Time, Distance, Pace) to calculate the remaining variable. Useful for race planning and training.",
  relatedTools: ["calorie-calculator"],
  schemaType: "WebApplication",
};
