import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Body Fat Calculator",
  slug: "body-fat-calculator",
  description: "Estimate your body fat percentage accurately using the U.S. Navy tape measure method.",
  longDescription: "Our free Body Fat Calculator provides a reliable estimation of your total body fat percentage using the proven U.S. Navy circumference method. An excellent tool for tracking fat loss and body recomposition beyond just weighing yourself on a scale.",
  category: "health",
  icon: "📉",
  keywords: ["body fat calculator", "us navy body fat method", "measure body fat percentage", "fitness tracking tools", "fat loss calculator", "body composition calculator", "neck waist hip measurements"],
  tags: ["calculator", "health"],
  component: () => import("./BodyFatCalculatorTool"),
  capabilities: { supportsOffline: true },
  faq: [
    { question: "How accurate is the U.S. Navy body fat method?", answer: "The U.S. Navy method is generally accurate to within 3-4% of your actual body fat percentage for most demographics. It is widely praised for being accessible anywhere since it only requires a simple tape measure." },
    { question: "What is a healthy body fat percentage?", answer: "Healthy body fat limits depend heavily on age and gender. Generally, for adult males, 8-19% is considered fit/healthy. For adult females, 21-32% is generally considered the healthy and fit range." },
    { question: "Why do women need to measure their hips?", answer: "Due to biological differences in physiological fat distribution, women typically carry more fat around their hips and thighs compared to men (who tend to carry it primarily in the abdomen), making hip circumferences essential for accurate calculations." }
  ],
  howItWorks: "Grab a flexible tape measure. Input your accurate standing height, neck circumference, waist circumference, and (for females) hip circumference. The tool performs the specific logarithmic U.S. Navy equations to estimate your fat composition.",
  relatedTools: ["bmi-calculator", "ideal-weight-calculator", "calorie-calculator"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
