import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Aspect Ratio Calculator",
  slug: "aspect-ratio",
  description: "Instantly scale dimensions proportionally",
  longDescription: "Use our Aspect Ratio Calculator to easily calculate and maintain proportional dimensions for images, videos, and UI elements. Perfect for web developers, designers, and video editors who need to scale media perfectly.",
  category: "calculators",
  icon: "📐",
  keywords: ["aspect ratio calculator", "image aspect ratio", "video dimensions", "scale image online", "proportion calculator", "16:9 calculator", "width and height calculator", "responsive design tools"],
  tags: ["design", "media", "calculator"],
  component: () => import("./AspectRatioTool"),
  capabilities: { supportsOffline: true },
  faq: [
    { question: "What are common aspect ratios?", answer: "Common ratios include 16:9 (standard HD video), 4:3 (legacy monitors and photography), 1:1 (square imagery for social media), 3:2 (standard photography), and 21:9 (ultrawide monitors)." },
    { question: "How do I calculate an aspect ratio?", answer: "By entering a known width and height, the tool simplifies the fraction to find the base ratio. Entering a target width or height will solve for the missing dimension using cross-multiplication." },
    { question: "Why is aspect ratio important in web design?", answer: "Maintaining the correct aspect ratio prevents images and videos from appearing stretched or distorted on varying screen sizes, ensuring a responsive and professional UI design." }
  ],
  howItWorks: "Enter the original width and height to discover the aspect ratio, or enter a target dimension along with the ratio to automatically calculate the exact matching width or height required for proportional scaling.",
  relatedTools: ["placeholder-image", "contrast-checker"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-18",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-05"
};
