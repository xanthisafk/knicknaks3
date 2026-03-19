import type { ToolDefinition } from "../_types";

export const definition: ToolDefinition = {
  name: "Color Blindness Simulator",
  slug: "color-blindness-simulator",

  description: "Preview images through color vision deficiency filters",

  category: "color",
  icon: "👩‍🦯",

  keywords: [
    "color blindness simulator",
    "color vision deficiency preview",
    "protanopia deuteranopia tritanopia tool",
    "accessibility color testing",
    "simulate color blindness online",
    "ui accessibility checker"
  ],

  tags: ["accessibility", "design", "colors"],

  component: () => import("./ColorBlindnessSimulatorTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "What conditions can I simulate?",
      answer:
        "Common color vision deficiencies including Protanopia (red-blind), Deuteranopia (green-blind), and Tritanopia (blue-blind)."
    },
    {
      question: "Why should I use this?",
      answer:
        "To identify contrast issues and avoid relying on color alone, improving accessibility for a wider audience."
    },
    {
      question: "How accurate are the simulations?",
      answer:
        "They use standard color transformation matrices to approximate perception. Useful for design validation, not medical diagnosis."
    },
    {
      question: "Are my images uploaded anywhere?",
      answer:
        "No. Processing happens entirely in your browser. Files never leave your device."
    },
    {
      question: "How common is color blindness?",
      answer:
        "Roughly 8% of males and 0.5% of females of Northern European descent are affected, most commonly with red or green deficiencies."
    },
    {
      question: "What's the best way to design for accessibility?",
      answer:
        "Ensure sufficient contrast, avoid color-only meaning, and pair colors with labels, patterns, or icons."
    }
  ],

  howItWorks:
    "Upload an image, choose a simulation mode, and the preview updates instantly to reflect how it appears under that condition.",

  relatedTools: ["image-color-picker"],

  schemaType: "WebApplication",
  createdAt: "2026-03-05",
  launchedAt: "2026-03-09",
  lastUpdated: "2026-03-18",
};