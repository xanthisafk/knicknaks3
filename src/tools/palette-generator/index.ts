import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Color Palette Generator",
  slug: "palette-generator",
  description: "Instantly generate harmonious, mathematically precise color schemes from a single seed color.",
  longDescription: "Kickstart your UI design process. Enter a single seed hex color, and our Palette Generator will instantly calculate beautiful, mathematically accurate color schemes. Effortlessly explore complete triadic, analogous, strictly complementary, and cascading monochromatic design palettes ready to use in your CSS.",
  category: "converters",
  icon: "🎨",
  keywords: ["color palette generator", "color scheme maker", "analogous color calculator", "triadic color wheel", "hex color harmony", "monochromatic css variables", "complementary color finder", "ui design themes"],
  tags: ["color", "design", "css"],
  component: () => import("./PaletteGeneratorTool"),
  capabilities: { supportsOffline: true, supportsClipboard: true },
  faq: [
    { question: "How are these specific colors chosen?", answer: "The mathematical relationships are mapped out on the traditional color wheel. For example, complementary colors are located directly opposite to each other, creating high visual contrast, while analogous colors sit adjacently, offering smooth blending." },
    { question: "What is a monochromatic palette?", answer: "A monochromatic scheme takes a single base hue and algorithmically adjusts only the saturation and lightness values. This guarantees a safe, beautifully consistent, and professional look across an entire brand layout." },
    { question: "How do I export the color codes?", answer: "Hover over any newly generated color swatch and click it to instantly copy either its exact HEX code or programmatic HSL value directly to your clipboard for rapid prototyping." }
  ],
  howItWorks: "Select your primary 'base' or 'seed' color using the interactive picker or type in an exact HEX value. Choose your desired mathematical color harmony rule (Analogous, Complementary, Triadic, etc.). The tool instantly outputs the perfectly matched color arrays.",
  relatedTools: ["color-converter", "contrast-checker", "gradient-maker"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
