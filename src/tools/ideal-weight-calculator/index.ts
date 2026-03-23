import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Ideal Weight Calculator",
  slug: "ideal-weight-calculator",
  description: "Calculate your ideal body weight based on scientific formulas",
  category: "health",
  icon: "⚖️",
  keywords: ["ideal weight calculator", "healthy weight target", "ibw calculator", "devine formula weight", "calculate my perfect weight", "healthy body weight range", "metrics weight calculator"],
  tags: ["calculator", "health"],
  component: () => import("./IdealWeightCalculatorTool"),
  capabilities: { supportsOffline: true },
  faq: [
    { question: "Which formula is the most accurate?", answer: "There is no single 'perfect' formula since body composition (muscle vs. fat) varies uniquely per person. The Devine formula is the most widely used in medical settings, but we display all four so you can establish a healthy average range." },
    { question: "Does age affect my ideal weight?", answer: "These classic formulas are strictly based on height and gender. While metabolism changes with age, the baseline 'ideal' weight representing a healthy BMI framework generally remains stable for mature adults." },
    { question: "Is this tool suitable for athletes or bodybuilders?", answer: "No. Since muscle weighs more than fat, highly muscular individuals often classify as 'overweight' under standard IBW formulas. Consider using a Body Fat Calculator instead." }
  ],
  howItWorks: "Select your biological gender and input your precise height. The calculator instantly runs your data through the Robinson, Miller, Devine, and Hamwi formulas, displaying a suggested healthy weight bracket in both kilograms and pounds.",
  relatedTools: ["bmi-calculator", "calorie-calculator", "body-fat-calculator"],
  schemaType: "WebApplication",
  updatedAt: "2026-03-13",
};
