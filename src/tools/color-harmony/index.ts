import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Color Harmony",
  slug: "color-harmony",
  description:
    "Build perfectly balanced color harmonies from a single HEX color. Instantly generate triadic, analogous, complementary, and monochromatic UI palettes.",

  longDescription:
    "Design better interfaces with mathematically precise color harmonies. Enter a single seed HEX color and instantly generate structured color relationships including triadic, analogous, complementary, and cascading monochromatic palettes. This tool helps designers and developers quickly explore balanced color systems for UI design, branding, and CSS variables without manually calculating color wheel relationships.",

  category: "color",
  icon: "💐",

  keywords: [
    "color harmony generator",
    "color harmony builder",
    "color scheme generator",
    "color palette from hex",
    "triadic color generator",
    "analogous color generator",
    "complementary color generator",
    "monochromatic color palette",
    "ui color palette generator",
    "css color palette generator",
    "design system color palette",
    "color wheel harmony tool",
    "hex color harmony calculator",
    "generate color palette for ui",
    "brand color palette generator"
  ],

  tags: ["color", "design", "ui", "css", "palette"],

  component: () => import("./ColorHarmonyTool"),

  capabilities: {
    supportsOffline: true,
    supportsClipboard: true,
  },

  faq: [
    {
      question: "What is a color harmony?",
      answer:
        "Color harmony refers to visually balanced color combinations derived from relationships on the color wheel. Common harmonies include complementary, analogous, triadic, and monochromatic schemes used in UI design, branding, and graphic design."
    },
    {
      question: "How does the color harmony builder work?",
      answer:
        "The tool takes a base HEX color and calculates mathematically related hues using traditional color theory rules. These include complementary (opposite colors), analogous (neighboring colors), triadic (evenly spaced colors), and monochromatic variations of the same hue."
    },
    {
      question: "What is a monochromatic color palette?",
      answer:
        "A monochromatic palette is created from a single base hue by adjusting only lightness and saturation values. This produces a cohesive and professional color system often used in modern UI design and design systems."
    },
    {
      question: "Can I use these colors in CSS?",
      answer:
        "Yes. Each generated color includes its HEX value and can easily be copied to your clipboard. These values can be used directly in CSS, design tokens, Tailwind themes, or other design systems."
    },
    {
      question: "Who is this tool for?",
      answer:
        "This tool is useful for UI designers, web developers, product designers, and brand designers who need to quickly generate harmonious color palettes for interfaces, websites, and design systems."
    }
  ],

  howItWorks:
    "Enter a base HEX color using the color picker or by typing the value manually. The tool analyzes the color on the color wheel and instantly generates harmonious color relationships including analogous, complementary, triadic, and monochromatic palettes. Click any color swatch to copy the HEX value for use in CSS, design systems, or UI mockups.",

  relatedTools: [
    "color-converter",
    "contrast-checker",
    "gradient-maker"
  ],

  schemaType: "WebApplication",
  lastUpdated: "2026-03-07",
};