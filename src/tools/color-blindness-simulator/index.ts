import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Color Blindness Simulator",
  slug: "color-blindness-simulator",
  description: "Preview images and colors as they appear to people with different types of color vision deficiencies.",
  longDescription:
    "Evaluate how accessible your visuals truly are by simulating common forms of color blindness directly in your browser. " +
    "Upload images, UI screenshots, charts, or graphics and instantly preview them through multiple vision deficiency filters such as Protanopia, Deuteranopia, and Tritanopia. " +
    "All processing happens locally on your device, ensuring complete privacy while helping designers and developers build more inclusive experiences.",

  category: "color",
  status: "beta",
  icon: "🎨",
  keywords: [
    "color blindness simulator online",
    "simulate color blindness",
    "protanopia simulator",
    "deuteranopia simulator",
    "tritanopia simulator",
    "accessibility color checker",
    "visual accessibility testing"
  ],
  tags: ["colors", "accessibility", "design"],

  component: () => import("./ColorBlindnessSimulatorTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "What types of color blindness can this simulator replicate?",
      answer:
        "The simulator can reproduce several common types of color vision deficiencies including Protanopia (red-blind), Deuteranopia (green-blind), Tritanopia (blue-blind), and general reduced color sensitivity."
    },
    {
      question: "Are my uploaded images sent to a server?",
      answer:
        "No. All image processing and simulation occurs directly within your browser using client-side rendering. Your images never leave your device."
    }
  ],

  howItWorks:
    "Upload an image or screenshot that you want to evaluate. Select a color vision deficiency type from the available filters and the preview will instantly update to simulate how the image appears to people with that condition.",

  relatedTools: ["image-color-picker"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-05",
};