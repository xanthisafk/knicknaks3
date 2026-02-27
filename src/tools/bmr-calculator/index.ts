import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "BMR Calculator",
  slug: "bmr-calculator",
  description: "Calculate your Basal Metabolic Rate (BMR) - the number of calories your body burns at rest.",
  category: "health",
  icon: "🔋",
  keywords: ["bmr", "basal metabolic rate", "metabolism", "calories", "health", "calculator"],
  tags: ["calculator", "health"],
  component: () => import("./BmrCalculatorTool"),
  capabilities: { supportsOffline: true },
  howItWorks: "Uses the Mifflin-St Jeor equation based on your age, gender, height, and weight to determine your resting energy expenditure.",
  relatedTools: ["calorie-calculator", "bmi-calculator", "body-fat-calculator"],
  schemaType: "WebApplication",
};
