import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Tailwind Color Palette",
  slug: "tailwind-colors",
  description: "Browse and copy Tailwind CSS color palette with hex codes and shades.",
  category: "color",
  icon: "🐦",
  keywords: [
    "tailwind colors",
    "tailwind color palette",
    "tailwind hex codes",
    "tailwind css colors list",
    "tailwind color shades",
    "tailwind colors chart",
    "tailwind palette generator",
    "copy tailwind colors",
    "tailwind slate zinc colors",
    "tailwind color reference"
  ],
  tags: ["design", "css", "tailwind", "reference"],
  component: () => import("./TailwindColorsTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },

  faq: [
    {
      question: "What colors are included in Tailwind CSS?",
      answer: "This tool includes all default Tailwind color families like slate, gray, zinc, red, blue, green, and more, each with shades from 50 to 950."
    },
    {
      question: "What do Tailwind color shades mean?",
      answer: "Shades range from 50 (lightest) to 950 (darkest). Lower numbers are softer tints, while higher numbers are deeper, more saturated tones."
    },
    {
      question: "How do I copy Tailwind color hex codes?",
      answer: "Click any color swatch to instantly copy its HEX value to your clipboard."
    },
    {
      question: "Can I export Tailwind colors as CSS variables?",
      answer: "Yes. Use the copy button to generate a full set of CSS variables for any color family."
    },
    {
      question: "Can I download the color palette?",
      answer: "Yes. You can export each color family as an image for design reference or sharing."
    },
    {
      question: "Is this tool useful for designers?",
      answer: "Yes. It provides a visual color scale for each palette, making it easy to pick consistent shades for UI design systems."
    },
    {
      question: "Does this tool work offline?",
      answer: "Yes. Once loaded or installed as a PWA, you can browse and copy colors offline."
    },
    {
      question: "Are these official Tailwind colors?",
      answer: "Yes. The palette matches the default Tailwind CSS color system."
    }
  ],

  howItWorks:
    "Search for a color family, browse all shades from 50 to 950, click any swatch to copy its hex code, or export the palette as CSS variables or an image. Runs entirely in your browser.",

  relatedTools: ["color-converter", "palette-generator", "gradient-maker"],
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-25",
};
