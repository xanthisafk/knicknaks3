import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "BMI Calculator",
  slug: "bmi-calculator",
  description: "Calculate your Body Mass Index (BMI)",
  longDescription: "Our free BMI (Body Mass Index) Calculator provides an immediate and accurate assessment of your body weight relative to your height. Use it to determine whether you are underweight, normal weight, overweight, or obese according to standard World Health Organization (WHO) categories.",
  category: "health",
  icon: "⚖️",
  keywords: ["bmi calculator", "calculate body mass index", "bmi checker online", "healthy weight calculator", "weight category finder", "who bmi calculation", "fitness tools", "health metrics"],
  tags: ["calculator", "health"],
  component: () => import("./BmiCalculatorTool"),
  capabilities: { supportsOffline: true },
  faq: [
    { question: "What is a healthy BMI?", answer: "According to the WHO, a normal, healthy BMI falls between 18.5 and 24.9. A BMI under 18.5 is considered underweight, 25.0 to 29.9 is overweight, and 30.0 or higher is obese." },
    { question: "Is BMI an accurate measure of health?", answer: "BMI is a highly useful screening tool but does not directly measure body fat. Muscle mass, bone density, and overall body composition can affect your weight, so athletes might have a high BMI without excess fat." },
    { question: "How is BMI calculated?", answer: "BMI is calculated by dividing an adult's weight in kilograms by their height in meters squared (kg/m²). Our calculator handles this math instantly." }
  ],
  howItWorks: "Simply enter your current height and weight. Our tool uses standard health formulas to calculate your exact BMI number and visually indicates which World Health Organization weight categorization you fall into.",
  relatedTools: ["calorie-calculator", "bmr-calculator", "ideal-weight-calculator"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-18",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-05"
};
