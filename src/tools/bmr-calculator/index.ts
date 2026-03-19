import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "BMR Calculator",
  slug: "bmr-calculator",
  description: "Calculate your Basal Metabolic Rate (BMR)",
  category: "health",
  icon: "🔋",
  keywords: ["bmr calculator online", "basal metabolic rate computation", "resting metabolism calculator", "daily calorie burn rate", "energy expenditure calculator", "fitness calorie tracking", "mifflin st jeor equation", "weight loss tool"],
  tags: ["calculator", "health"],
  component: () => import("./BmrCalculatorTool"),
  capabilities: { supportsOffline: true },
  faq: [
    { question: "What exactly is BMR?", answer: "Basal Metabolic Rate (BMR) represents the absolute minimum number of calories your body needs to endure basic, life-sustaining functions (like breathing, blood circulation, and cell production) during a 24-hour period of resting." },
    { question: "How does the BMR calculation work?", answer: "Our calculator utilizes the Mifflin-St Jeor equation, which is widely considered the most reliable method for estimating resting energy expenditure based on physiological markers like age, gender, height, and weight." },
    { question: "How is BMR different from TDEE?", answer: "BMR only accounts for the calories burned at complete rest. Your Total Daily Energy Expenditure (TDEE) multiplies your BMR by an activity factor to account for physical movement and exercise throughout the day." }
  ],
  howItWorks: "Provide your biological age, gender, exact height, and weight. The calculator instantly processes this data strictly using the validated Mifflin-St Jeor scientific formula to report your daily resting burned calories.",
  relatedTools: ["calorie-calculator", "bmi-calculator", "body-fat-calculator"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-18",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-05"
};
