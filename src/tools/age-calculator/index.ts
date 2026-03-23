import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Age Calculator",
  slug: "age-calculator",
  description: "Calculate precise age and get some fun stats!",
  category: "calculators",
  icon: "🎂",
  keywords: ["age calculator", "calculate age online", "date of birth calculator", "age difference", "years months days calculator", "exact age calculator", "birthday calculator", "chronological age"],
  tags: ["calculator", "date"],
  component: () => import("./AgeCalculatorTool"),
  capabilities: { supportsOffline: true },
  faq: [
    { question: "How does the age calculator work?", answer: "The calculator computes the exact time difference between your selected birth date and the current or target date, factoring in leap years and varying month lengths for accurate results." },
    { question: "Is my birth date data saved?", answer: "No, all calculations are performed locally in your browser. We never store or transmit your personal data." },
    { question: "Can I calculate age for a future date?", answer: "Yes, you can select any past or future target date to calculate what your exact age was or will be on that specific day." },
  ],
  howItWorks: "Simply enter your birth date and an optional target date. The calculator instantly processes the dates and displays your exact age in years, months, days, along with additional bonus statistics.",
  relatedTools: ["unix-timestamp", "percentage-calc"],
  schemaType: "WebApplication",
  updatedAt: "2026-03-15",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-05"
};
