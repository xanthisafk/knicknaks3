import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Color Converter",
  slug: "color-converter",
  description: "Convert colors between HEX, RGB, HSL, and CMYK formats",
  category: "color",
  icon: "🎨",
  keywords: ["color converter online", "hex to rgb calculator", "rgb to hsl converter", "css color format tool", "cmyk print color code", "html color picker", "color translation format"],
  tags: ["color", "design", "css"],

  component: () => import("./ColorConverterTool"),

  capabilities: {
    supportsClipboard: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "Which color formats are supported?",
      answer: "We support hexadecimal HEX (#RRGGBB), standard RGB (0-255 arrays), modern HSL (hue, saturation, lightness variations), and CMYK (Cyan, Magenta, Yellow, Key/Black) used for physical printing.",
    },
    {
      question: "How accurate is the CMYK screen conversion?",
      answer:
        "The digital display conversion relies on standard mathematical formulas to approximate CMYK. Since screens emit light (RGB) and printers absorb light (CMYK), for extreme precision printing always verify colors against a physical Pantone book or a professional color management system using ICC profiles.",
    },
    {
      question: "Why use HSL over RGB in CSS?",
      answer: "HSL (Hue, Saturation, Lightness) is vastly more intuitive for human designers. If you have a brand color in HSL, you can trivially create lighter/darker shades just by adjusting the single 'Lightness' percentage, which is mathematically difficult in raw RGB."
    }
  ],

  howItWorks:
    "Either paste your known color string into any supported format field, or directly use the browser's native visual color picker. All adjacent color formats will " +
    "recalculate and update themselves automatically. Simply click any resulting value box to effortlessly copy it to your operating system clipboard.",

  relatedTools: ["palette-generator", "contrast-checker", "gradient-maker"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-18",
};
