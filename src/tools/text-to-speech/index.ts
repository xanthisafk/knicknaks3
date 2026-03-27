import type { ToolDefinition } from "@/tools/_types";

export const definition: ToolDefinition = {
  name: "Text to Speech (Kokoro)",
  slug: "kokoro-tts",
  description: "Convert text to realistic AI speech in your browser.",
  category: "ai",
  icon: "🗣️",
  keywords: [
    "text to speech",
    "ai voice generator",
    "browser text to speech",
    "offline text to speech",
    "kokoro tts",
    "neural voice generator",
    "realistic ai voice",
    "text to audio",
    "speech synthesis online",
    "tts without api",
    "local ai voice generator",
    "read text aloud online",
    "webgpu tts",
    "onnx text to speech"
  ],
  tags: ["ai", "audio", "tts", "speech"],
  component: () => import("./TextToSpeechTool"),
  capabilities: { supportsOffline: true },
  status: "beta",
  faq: [
    {
      question: "Does this text to speech tool work offline?",
      answer: "Yes. After the model is loaded, all speech generation runs locally in your browser without any internet connection."
    },
    {
      question: "Is my text sent to a server?",
      answer: "No. Your input stays entirely on your device. This tool performs speech synthesis locally for full privacy."
    },
    {
      question: "How realistic are the voices?",
      answer: "The Kokoro model produces high-quality neural voices with natural tone, pacing, and pronunciation."
    },
    {
      question: "What is WebGPU and should I use it?",
      answer: "WebGPU enables GPU acceleration in supported browsers, significantly improving performance compared to CPU (WASM)."
    },
    {
      question: "Why does the model need to download first?",
      answer: "The AI model must be loaded into your browser before generation. This is a one-time download after which it will be cached for future use."
    },
    {
      question: "Can I generate long audio files?",
      answer: "Yes, but very long inputs may take more time depending on your device performance."
    },
    {
      question: "What voice options are available?",
      answer: "Multiple voices with different accents and quality grades are available. Higher grades typically sound more natural."
    },
    {
      question: "What does precision (q8, etc.) mean?",
      answer: "Precision controls model size and performance. Lower precision is faster but slightly less accurate, while higher precision improves quality."
    },
    {
      question: "Can I download the generated audio?",
      answer: "Yes. Once generated, you can play and save the audio file directly from your browser."
    },
    {
      question: "Is this better than traditional TTS APIs?",
      answer: "This tool prioritizes privacy and offline use, unlike cloud TTS APIs that require network requests and API keys."
    }
  ],
  howItWorks:
    "The tool downloads a lightweight Kokoro AI model into your browser. After selecting a voice, it converts text into natural speech locally using CPU or GPU acceleration.",
  schemaType: "WebApplication",
  createdAt: "2026-03-03",
  launchedAt: "2026-03-03",
  updatedAt: "2026-03-27",
};
