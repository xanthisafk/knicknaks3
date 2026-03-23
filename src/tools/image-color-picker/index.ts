import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Image Color Picker",
  slug: "image-color-picker",
  description: "Extract dominant colors and generate a palette from image",
  category: "color",
  icon: "🖌️",
  keywords: [
    "image color picker online",
    "extract colors from image",
    "generate color palette",
    "dominant color extractor",
    "get hex color from image",
    "image palette generator",
    "color palette from photo"
  ],
  tags: ["colors", "design", "image"],

  component: () => import("./ImageColorPickerTool"),

  capabilities: {
    supportsFileInput: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "How are dominant colors detected?",
      answer:
        "The tool analyzes pixel color distribution in your image and groups similar shades together to identify the most dominant colors present."
    },
    {
      question: "Does this tool upload my images?",
      answer:
        "No. All color extraction happens locally inside your browser. Your images are never uploaded or stored anywhere."
    }
  ],

  howItWorks:
    "Upload any image and the tool will analyze its pixels to determine the most dominant colors. A palette is automatically generated with HEX and RGB values that you can copy for use in design, branding, or development.",

  relatedTools: ["color-blindness-simulator"],
  schemaType: "WebApplication",
  createdAt: "2026-03-05",
  launchedAt: "2026-03-05",
  updatedAt: "2026-03-19",
};