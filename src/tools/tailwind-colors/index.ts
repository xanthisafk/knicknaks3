import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Tailwind Color Reference",
  slug: "tailwind-colors",
  description: "Searchable reference cheat sheet for all Tailwind CSS v3 and v4 default color palettes.",
  longDescription: "Speed up your web design workflow with our interactive Tailwind Color Reference. Instantly browse, search, and copy hex codes or utility class names for every single color swatch in the official Tailwind CSS default palette. Supports both legacy v3 and the latest v4 design systems.",
  category: "dev",
  icon: "🐦",
  keywords: ["tailwind color palette", "tailwind hex codes", "tailwind css colors", "tailwind v4 palette", "copy tailwind classes", "tailwind color shades", "tailwind slate zinc"],
  tags: ["design", "css", "tailwind", "reference"],
  component: () => import("./TailwindColorsTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "Which numeric shades are included?", answer: "The tool includes every standard shade from 50 (lightest) to 950 (darkest) for all color families natively provided by the framework." },
    { question: "Can I use this for Tailwind v4?", answer: "Yes! Use the toggle at the top of the interface to seamlessly switch between the classic version 3 palette and the slightly updated version 4 color scheme." },
    { question: "How do I use this?", answer: "Simply find the color you like (e.g., 'emerald-500'). Clicking the swatch will instantly copy its raw HEX value (e.g., '#10b981') or its CSS utility class name directly to your clipboard." }
  ],
  howItWorks: "Scroll through the categorized visual swatches or use the search bar to find a specific color family like 'blue' or 'slate'. Click the toggle to switch between v3 and v4, and click any color block to copy its details.",
  relatedTools: ["color-converter", "palette-generator", "gradient-maker"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
