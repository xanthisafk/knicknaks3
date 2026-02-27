import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Color Converter",
  slug: "color-converter",
  description: "Convert colors between HEX, RGB, HSL, and CMYK formats with a live preview swatch.",
  longDescription:
    "Seamlessly convert colors between HEX, RGB, HSL, and CMYK formats. Features a live color preview " +
    "swatch, interactive color picker, and one-click copy for each format.",
  category: "converters",
  icon: "🎨",
  keywords: ["color", "convert", "hex", "rgb", "hsl", "cmyk", "picker", "css"],
  tags: ["color", "design", "css"],

  component: () => import("./ColorConverterTool"),

  capabilities: {
    supportsClipboard: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "What color formats are supported?",
      answer: "HEX (#RRGGBB), RGB (0-255), HSL (hue/saturation/lightness), and CMYK (for print).",
    },
    {
      question: "How accurate is the CMYK conversion?",
      answer:
        "The conversion uses a mathematical formula. For precise print colors, always use a " +
        "professional color management system with ICC profiles.",
    },
  ],

  howItWorks:
    "Enter a color in any supported format, or use the native color picker. All other formats " +
    "update automatically. Click any value to copy it to your clipboard.",

  relatedTools: ["palette-generator", "contrast-checker", "gradient-maker"],
  schemaType: "WebApplication",
  lastUpdated: "2026-02-26",
};
