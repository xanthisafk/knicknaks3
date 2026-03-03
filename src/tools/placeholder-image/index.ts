import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Placeholder Image Generator",
  slug: "placeholder-image",
  description: "Instantly generate custom SVG placeholder images offline with no external CDN dependency.",
  longDescription: "Build resilient web layouts exactly simulating final asset delivery without relying on third-party dummy image servers (which occasionally go offline). Our local Placeholder Image Generator creates pure SVG data URIs or downloadable files tailored exactly to your specified dimension, text label, and color schemes.",
  category: "generators",
  icon: "🖼️",
  keywords: ["placeholder image generator", "dummy image maker offline", "svg placeholder code", "mockup picture creator", "generate image data uri", "wireframe image tool", "custom size dummy photo"],
  tags: ["design", "generator", "images"],
  component: () => import("./PlaceholderImageTool"),
  capabilities: { supportsOffline: true },
  faq: [
    { question: "What formats do these placeholders come in?", answer: "The generator produces pure, mathematically-drawn SVG vector files. You can export them as a downloadable `.svg` file, or as an embedded `data:` URI string to paste directly into an HTML `<img>` tag." },
    { question: "Why use SVGs instead of PNG/JPG placeholders?", answer: "SVG files are infinitely scalable without losing resolution, resulting in dramatically smaller file sizes. Returning a small data URI means your HTML mockup loads instantly without firing an extra network request to a dusty third-party server." },
    { question: "Can I customize the displayed text?", answer: "Yes. By default, the image displays its exact dimensions (e.g., '600 x 400'), but you can easily override this with any custom text string you require." }
  ],
  howItWorks: "Input your exact target pixel width and height. Optionally override the visual background and text colors using exact Hex values, and type out a custom label. Instantly copy the resulting lightweight `<svg>` code, Data URI format, or click to download the raw file.",
  relatedTools: ["aspect-ratio", "color-converter"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
