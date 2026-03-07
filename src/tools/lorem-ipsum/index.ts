import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Lorem Ipsum Generator",
  slug: "lorem-ipsum",
  description: "Generate classic Lorem Ipsum placeholder",
  longDescription:
    "Instantly generate standard professional placeholder text for your website mockups, print layouts, and graphic designs. Customize your output exactly by strictly defining the desired number of paragraphs, " +
    "sentences, or individual words. Easily copy the generated Latin text to your clipboard with a single click.",
  category: "generators",
  icon: "📜",
  keywords: ["lorem ipsum generator", "placeholder text maker", "dummy text creator", "design mockup text", "generate latin paragraphs", "website filler text", "copy paste lorem ipsum"],
  tags: ["text", "generator", "design"],

  component: () => import("./LoremIpsumTool"),

  capabilities: {
    supportsClipboard: true,
    supportsOffline: true,
  },

  faq: [
    {
      question: "What does Lorem Ipsum mean?",
      answer:
        "Lorem Ipsum is nonsensical placeholder text used heavily in design and typesetting to visually simulate real content structure without distracting the viewer with readable English. " +
        "It actually originates from a 1st-century BC Latin text written by Cicero.",
    },
    {
      question: "Why not just use regular English text?",
      answer: "Using readable English in a design mockup often distracts clients, causing them to focus on the written content itself rather than evaluating the visual layout and typographic design."
    },
    {
      question: "Can I generate HTML tags with the text?",
      answer: "Currently, the tool outputs raw, unformatted text strings. If you select 'Paragraphs', spacing is maintained via standard newline characters formatted for easy pasting into design tools."
    }
  ],

  howItWorks:
    "Select your desired output metric (paragraphs, individual sentences, or word count) using the dropdown, then enter the specific quantity. " +
    "Click 'Generate' to instantly produce a unique block of classic placeholder text, and click the copy button to transfer it to your clipboard.",

  relatedTools: ["word-counter", "markdown-preview"],
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};
