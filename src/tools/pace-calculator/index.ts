import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Pace Calculator",
  slug: "pace-calculator",
  description: "Accurately calculate running pace, finish time, or distance for races and training",
  category: "health",
  icon: "🏃",
  keywords: [
    "running pace calculator",
    "marathon pace calculator",
    "finish time predictor",
    "calculate running speed",
    "5k 10k pace chart",
    "half marathon pace",
    "mile pace calculator",
    "training split calculator",
    "cycling speed calculator",
    "swim pace calculator"
  ],
  tags: ["calculator", "health", "sports"],
  component: () => import("./PaceCalculatorTool"),
  capabilities: { supportsOffline: true },

  faq: [
    {
      question: "How do I calculate my required race pace?",
      answer: "Enter your race distance and your target finish time. The calculator instantly determines the exact pace per mile or kilometer you need to maintain to reach that goal."
    },
    {
      question: "Can I calculate finish time from my pace?",
      answer: "Yes. Input your pace and total distance, and the tool will compute your expected finish time with second-level precision."
    },
    {
      question: "Can I calculate distance from time and pace?",
      answer: "Yes. If you know how long you ran and your average pace, the calculator will determine the total distance covered."
    },
    {
      question: "Does it support both miles and kilometers?",
      answer: "Yes. You can switch between metric (kilometers, meters) and imperial (miles) units at any time, making it suitable for international races and training plans."
    },
    {
      question: "Can I use this for cycling or swimming?",
      answer: "Yes. While designed for running, the calculator works for any activity where pace, distance, and time are related, including cycling and swimming."
    },
    {
      question: "Does it work for standard race distances like 5K or marathon?",
      answer: "Yes. You can quickly select common race distances such as 5K, 10K, half marathon, and marathon without manual entry."
    },
    {
      question: "How accurate is the calculator?",
      answer: "The calculator uses exact unit conversions and second-level precision. Results are mathematically accurate, though real-world performance may vary due to terrain, weather, and fatigue."
    },
    {
      question: "Does it work offline?",
      answer: "Yes. If you install the app as a Progressive Web App (PWA), the calculator works fully offline without an internet connection."
    }
  ],

  howItWorks:
    "This tool solves the fundamental relationship between time, distance, and pace. By entering any two of these variables, the calculator computes the third using precise unit conversions and time normalization.",

  relatedTools: ["calorie-calculator"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-22",
};