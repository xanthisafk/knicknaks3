import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Calorie Calculator",
  slug: "calorie-calculator",
  description: "Estimate the number of calories you need to consume daily to maintain, lose, or gain weight.",
  category: "health",
  icon: "🔥",
  keywords: ["calorie", "diet", "nutrition", "weight loss", "maintenance", "calculator", "health"],
  tags: ["calculator", "health"],
  component: () => import("./CalorieCalculatorTool"),
  capabilities: { supportsOffline: true },
  howItWorks: "Input your age, gender, height, weight, and activity level. Calculates daily calorie needs using the Mifflin-St Jeor equation and applies activity multipliers.",
  relatedTools: ["bmr-calculator", "bmi-calculator", "ideal-weight-calculator"],
  schemaType: "WebApplication",
};
