import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Placeholder Image Generator",
  slug: "placeholder-image",
  description: "Generate custom placeholder images with text, colors, and export options",
  category: "generators",
  icon: "🖼️",
  keywords: [
    "placeholder image generator",
    "dummy image generator",
    "svg png jpg placeholder",
    "image data uri generator",
    "mockup placeholder tool",
    "custom size image generator",
    "wireframe placeholder image"
  ],
  tags: ["design", "generator", "images", "frontend"],
  component: () => import("./PlaceholderImageTool"),
  capabilities: { supportsOffline: true },
  faq: [
    {
      question: "What formats can I export?",
      answer: "You can download placeholders as SVG, PNG, or JPG. SVG is vector-based, while PNG and JPG are rasterized versions generated from canvas."
    },
    {
      question: "What is a Data URI and why use it?",
      answer: "A Data URI embeds the image directly in your HTML or CSS, eliminating external requests. This is useful for prototyping, emails, or lightweight UI mockups."
    },
    {
      question: "Can I customize the placeholder text?",
      answer: "Yes. You can override the default dimensions label with any custom text, along with background and text colors."
    }
  ],
  howItWorks: "Set width, height, colors, and optional label. The tool renders a live preview and lets you copy a Data URI, HTML <img> tag, or download the image in your chosen format.",
  relatedTools: ["aspect-ratio", "color-converter"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-23",
};