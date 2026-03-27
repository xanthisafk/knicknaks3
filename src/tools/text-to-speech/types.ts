export type KokoroTTS = any;


export type VoiceAccent = "American" | "British";
export type VoiceGender = "Female" | "Male";
export type DType = "fp32" | "fp16" | "q8" | "q4" | "q4f16";
export type Device = "wasm" | "webgpu";
export type VoiceGrade = "A" | "A-" | "B-" | "C+" | "C" | "C-" | "D+" | "D" | "D-" | "F+";

export interface VoiceInfo {
    id: string;
    label: string;
    traits: string;
    grade: VoiceGrade;
    description: string;
    accent: VoiceAccent;
    gender: VoiceGender;
}

export interface GenerationState {
    status: "idle" | "loading-model" | "generating" | "ready" | "error";
    progress: number | null;
    errorMessage: string | null;
}

export const VOICES: VoiceInfo[] = [
    { id: "af_heart", label: "Heart", traits: "❤️", grade: "A", description: "Warm, expressive American female. The top-rated voice — natural and emotive.", accent: "American", gender: "Female" },
    { id: "af_bella", label: "Bella", traits: "🔥", grade: "A-", description: "High-energy American female. Extensively trained, near top-tier.", accent: "American", gender: "Female" },
    { id: "af_nicole", label: "Nicole", traits: "🎧", grade: "B-", description: "ASMR-inflected American female. Soft and close-mic feel.", accent: "American", gender: "Female" },
    { id: "af_aoede", label: "Aoede", traits: "", grade: "C+", description: "American female with a smooth tone. Decent quality.", accent: "American", gender: "Female" },
    { id: "af_kore", label: "Kore", traits: "", grade: "C+", description: "Balanced American female. Good for neutral narration.", accent: "American", gender: "Female" },
    { id: "af_sarah", label: "Sarah", traits: "", grade: "C+", description: "Crisp American female. Reliable for everyday TTS.", accent: "American", gender: "Female" },
    { id: "af_alloy", label: "Alloy", traits: "", grade: "C", description: "Clean American female voice. Mid-tier training.", accent: "American", gender: "Female" },
    { id: "af_nova", label: "Nova", traits: "", grade: "C", description: "Bright American female. Average training.", accent: "American", gender: "Female" },
    { id: "af_sky", label: "Sky", traits: "", grade: "C-", description: "Light American female. Minimal training — use sparingly.", accent: "American", gender: "Female" },
    { id: "af_jessica", label: "Jessica", traits: "", grade: "D", description: "American female, lower quality — minimal training data.", accent: "American", gender: "Female" },
    { id: "af_river", label: "River", traits: "", grade: "D", description: "American female. Limited training, lower fidelity.", accent: "American", gender: "Female" },
    { id: "am_fenrir", label: "Fenrir", traits: "", grade: "C+", description: "American male with a deeper quality. Solid for narration.", accent: "American", gender: "Male" },
    { id: "am_michael", label: "Michael", traits: "", grade: "C+", description: "American male. Well-trained, dependable voice.", accent: "American", gender: "Male" },
    { id: "am_puck", label: "Puck", traits: "", grade: "C+", description: "American male with a lighter tone. Decent for character voices.", accent: "American", gender: "Male" },
    { id: "am_echo", label: "Echo", traits: "", grade: "D", description: "American male. Low training data, inconsistent output.", accent: "American", gender: "Male" },
    { id: "am_eric", label: "Eric", traits: "", grade: "D", description: "American male. Low training, acceptable for short clips.", accent: "American", gender: "Male" },
    { id: "am_liam", label: "Liam", traits: "", grade: "D", description: "American male. Limited data.", accent: "American", gender: "Male" },
    { id: "am_onyx", label: "Onyx", traits: "", grade: "D", description: "American male. Limited training.", accent: "American", gender: "Male" },
    { id: "am_santa", label: "Santa", traits: "🎅", grade: "D-", description: "Novelty American male. Very minimal training — holiday fun only.", accent: "American", gender: "Male" },
    { id: "am_adam", label: "Adam", traits: "", grade: "F+", description: "American male. Very limited training — noticeably rough.", accent: "American", gender: "Male" },
    { id: "bf_emma", label: "Emma", traits: "", grade: "B-", description: "British female with polished delivery. Well-trained.", accent: "British", gender: "Female" },
    { id: "bf_isabella", label: "Isabella", traits: "", grade: "C", description: "Elegant British female. Average training.", accent: "British", gender: "Female" },
    { id: "bf_alice", label: "Alice", traits: "", grade: "D", description: "British female. Recognizable accent, limited training.", accent: "British", gender: "Female" },
    { id: "bf_lily", label: "Lily", traits: "", grade: "D", description: "British female. Light training, lower consistency.", accent: "British", gender: "Female" },
    { id: "bm_fable", label: "Fable", traits: "", grade: "C", description: "British male storyteller tone. Decent for longer reads.", accent: "British", gender: "Male" },
    { id: "bm_george", label: "George", traits: "", grade: "C", description: "British male. Clear and measured.", accent: "British", gender: "Male" },
    { id: "bm_lewis", label: "Lewis", traits: "", grade: "D+", description: "British male. Some training, below average.", accent: "British", gender: "Male" },
    { id: "bm_daniel", label: "Daniel", traits: "", grade: "D", description: "British male. Limited training.", accent: "British", gender: "Male" },
];

export const DTYPES: DType[] = ["fp32", "fp16", "q8", "q4", "q4f16"];
export const DEVICES: Device[] = ["wasm", "webgpu"];

export const DTYPE_INFO: Record<DType, string> = {
    fp32: "Full 32-bit precision. Best quality, largest download (~300 MB).",
    fp16: "Half-precision. Near-identical quality at half the size. Requires WebGPU.",
    q8: "8-bit quantized. Best quality/speed balance. Recommended.",
    q4: "4-bit quantized. Smaller and faster, slight quality drop.",
    q4f16: "4-bit weights + fp16 activations. Fast on WebGPU.",
};

export const DEVICE_INFO: Record<Device, string> = {
    wasm: "CPU via WebAssembly. Works everywhere, no special hardware needed. Slower.",
    webgpu: "GPU acceleration. Much faster. Requires Chrome 113+ with WebGPU support.",
};