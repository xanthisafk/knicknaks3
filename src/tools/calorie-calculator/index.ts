import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Calorie Calculator",
  slug: "calorie-calculator",
  description: "Calculate your daily calorie needs",
  longDescription: "Our free Calorie Calculator provides an accurate estimate of the exact number of calories you need to consume each day to maintain your current weight, lose fat, or gain muscle. A crucial first step for any diet or fitness journey.",
  category: "health",
  icon: "🔥",
  keywords: ["calorie calculator", "daily calorie needs", "tdee calculator", "weight loss calories", "diet calculator", "nutrition tracking", "maintenance calories", "fitness calorie goals"],
  tags: ["calculator", "health"],
  component: () => import("./CalorieCalculatorTool"),
  capabilities: { supportsOffline: true },
  faq: [
    { question: "How are my daily calories calculated?", answer: "This tool calculates your Basal Metabolic Rate (BMR) using the highly accurate Mifflin-St Jeor equation, and then multiplies it by your selected physical activity level to determine your Total Daily Energy Expenditure (TDEE)." },
    { question: "How many calories should I cut to lose weight?", answer: "A generally safe and sustainable rate of fat loss is about 1 to 2 pounds per week, which typically requires a daily caloric deficit of roughly 500 to 1,000 calories below your maintenance TDEE." },
    { question: "Are these results perfectly accurate?", answer: "These results are an excellent scientific estimate to start your diet. However, individual metabolisms vary, so treat this number as a baseline and adjust based on your real-world progress." }
  ],
  howItWorks: "Simply enter your age, gender, accurate height, current weight, and average weekly activity level. The calculator instantly processes these variables through proven nutritional formulas to present your customized daily caloric targets.",
  relatedTools: ["bmr-calculator", "bmi-calculator", "ideal-weight-calculator"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
