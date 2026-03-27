import { encodeWAV } from "@/lib/audioHelper";
import type { KokoroTTS } from "kokoro-js";

const MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";

let tts: KokoroTTS | null = null;

self.onmessage = async (e: MessageEvent) => {
    const { type, payload } = e.data;

    try {
        if (type === "INIT") {
            const { dtype, device } = payload;

            const { KokoroTTS } = await import("kokoro-js");

            tts = await KokoroTTS.from_pretrained(MODEL_ID, {
                dtype,
                device,
                progress_callback: (p: any) => {
                    if (p?.progress != null) {
                        self.postMessage({ type: "PROGRESS", progress: Math.round(p.progress) });
                    }
                },
            });

            self.postMessage({ type: "READY" });
        }

        if (type === "GENERATE") {
            if (!tts) throw new Error("Model not initialized");

            const { text, voiceId } = payload;

            const output = await tts.generate(text, { voice: voiceId as any });

            const pcm: Float32Array = output.audio;
            const sampleRate: number = output.sampling_rate ?? 24000;

            const wav = encodeWAV(pcm, sampleRate);

            const ctx = self as unknown as DedicatedWorkerGlobalScope;
            ctx.postMessage({ type: "RESULT", wav }, [wav]);
        }
    } catch (err: any) {
        self.postMessage({ type: "ERROR", message: err?.message || "Worker error" });
    }
};