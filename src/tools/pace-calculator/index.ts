import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Pace Calculator",
  slug: "pace-calculator",
  description: "Calculate your exact running pace for effective marathon training",
  longDescription: "Take the mathematical guesswork out of your race day preparation. Our advanced Pace Calculator allows runners and cyclists to input two known variables (like distance and finish time) to instantly solve for the missing metric (required pace). Optimize your training splits for 5Ks, half-marathons, and full marathons.",
  category: "health",
  icon: "🏃",
  keywords: ["running pace calculator", "marathon finish time predictor", "calculate run speed", "5k 10k pace chart", "cycling speed calculator", "training split times", "athletic distance time pace"],
  tags: ["calculator", "health", "sports"],
  component: () => import("./PaceCalculatorTool"),
  capabilities: { supportsOffline: true },
  faq: [
    { question: "How do I calculate my required race pace?", answer: "Simply enter the total distance of your race (e.g., 26.2 miles for a marathon) and your goal finish time (e.g., 4 hours). The calculator instantly reveals the exact minute/mile pace you must maintain to hit that specific target." },
    { question: "Can I use this for cycling or swimming?", answer: "Yes! While primarily used by runners, cyclists and swimmers can easily use the calculator to determine overall speed thresholds by switching the primary distance metrics (miles, kilometers, meters)." },
    { question: "Does it support both miles and kilometers?", answer: "Absolutely. You can freely toggle the calculator between Imperial (miles) and Metric (kilometers) systems, allowing seamless split conversions for international race planning." }
  ],
  howItWorks: "The calculator fundamentally acts as a three-way equation. Enter any two of the three primary variables (Total Time, Total Distance, or Target Pace). The tool automatically calculates and fills in the remaining third field instantly.",
  relatedTools: ["calorie-calculator"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
