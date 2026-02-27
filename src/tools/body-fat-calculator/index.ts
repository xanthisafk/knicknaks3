import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Body Fat Calculator",
  slug: "body-fat-calculator",
  description: "Estimate your body fat percentage using the U.S. Navy Method.",
  category: "health",
  icon: "📉",
  keywords: ["body fat", "navy method", "fitness", "health", "calculator", "weight"],
  tags: ["calculator", "health"],
  component: () => import("./BodyFatCalculatorTool"),
  capabilities: { supportsOffline: true },
  howItWorks: "Uses the U.S. Navy circumference method. Input your height, neck, waist, and (for females) hip measurements.",
  relatedTools: ["bmi-calculator", "ideal-weight-calculator", "calorie-calculator"],
  schemaType: "WebApplication",
};
