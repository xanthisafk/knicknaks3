import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text to Speech (Kokoro)",
  slug: "kokoro-tts",
  description: "Locally generate ultra-realistic AI speech from text utilizing WebAssembly and the Kokoro TTS model.",
  longDescription: "Turn any script into studio-quality audio directly on your device. Unlike traditional robotic-sounding browser APIs which rely heavily on massive corporate servers, this Text-to-Speech tool executes a heavily optimized, quantized AI voice model (Kokoro) completely offline. Enjoy zero API costs and total data privacy while generating incredibly lifelike spoken audio.",
  category: "ai",
  icon: "🗣️",
  keywords: ["ai text to speech online", "kokoro tts browser", "local voice generator", "offline ai speech tool", "ultra realistic voice synthesis", "read text aloud ai", "browser based tts voice"],
  tags: ["ai", "audio", "experimental"],
  component: () => import("./TextToSpeechTool"),
  capabilities: { supportsOffline: true },
  faq: [
    { question: "Is my text data sent to a cloud server to synthesize the voice?", answer: "Absolutely not. After completing a one-time download of the neural network voice models (which are heavily compressed), the actual Artificial Intelligence computations run entirely on your own local device using modern WebAssembly!" },
    { question: "Why does it take so long to generate the first audio clip?", answer: "Because the machine learning relies entirely on your local hardware architecture, generating speech on older smartphones or lacking CPUs will be significantly slower than running it on a powerful, dedicated desktop computer." },
    { question: "Can I download the generated speech files?", answer: "Yes! Once the AI engine finishes synthesizing your textual input into an audio buffer, you can instantly replay it or click to download the crisp `.wav` file directly to your hard drive." }
  ],
  howItWorks:
    "Upon initialization, your browser downloads a compact version of the Kokoro ONNX machine learning model. After selecting a distinct voice profile, you input your desired script. Clicking 'Generate' triggers your local CPU to synthesize the text into incredibly human-sounding audio.",
  schemaType: "WebApplication",
  lastUpdated: "2026-03-03",
};