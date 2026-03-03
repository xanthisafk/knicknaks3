import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text to Speech (Kokoro)",
  slug: "kokoro-tts",
  description: "Generate realistic speech directly in your browser using Kokoro.",
  category: "ai",
  icon: "🗣️",
  keywords: ["tts", "text to speech", "ai voice", "kokoro", "speech"],
  tags: ["ai", "audio", "experimental"],
  component: () => import("./TextToSpeechTool"),
  capabilities: { supportsOffline: true },
  howItWorks:
    "Loads a quantized Kokoro ONNX model in your browser and generates speech locally using WebAssembly.",
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};