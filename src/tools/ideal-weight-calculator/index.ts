import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Ideal Weight Calculator",
  slug: "ideal-weight-calculator",
  description: "Calculate your ideal body weight based on height, gender, and frame size.",
  category: "health",
  icon: "⚖️",
  keywords: ["ideal weight", "healthy weight", "fitness", "health", "calculator"],
  tags: ["calculator", "health"],
  component: () => import("./IdealWeightCalculatorTool"),
  capabilities: { supportsOffline: true },
  howItWorks: "Uses popular formulas (Robinson, Miller, Devine, Hamwi) to calculate your ideal weight range based on your gender and height.",
  relatedTools: ["bmi-calculator", "calorie-calculator", "body-fat-calculator"],
  schemaType: "WebApplication",
};
