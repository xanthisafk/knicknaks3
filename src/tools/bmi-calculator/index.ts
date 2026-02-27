import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "BMI Calculator",
  slug: "bmi-calculator",
  description: "Calculate your Body Mass Index (BMI) and determine your weight category.",
  category: "health",
  icon: "⚖️",
  keywords: ["bmi", "body mass index", "health", "weight", "fitness", "calculator"],
  tags: ["calculator", "health"],
  component: () => import("./BmiCalculatorTool"),
  capabilities: { supportsOffline: true },
  howItWorks: "Enter your height and weight. The tool calculates your BMI and indicates which weight category you fall into based on WHO guidelines.",
  relatedTools: ["calorie-calculator", "bmr-calculator", "ideal-weight-calculator"],
  schemaType: "WebApplication",
};
