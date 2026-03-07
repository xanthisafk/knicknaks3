import { useEffect, useRef, useState } from "react";
import { Panel } from "@/components/layout";
import { Input } from "@/components/ui";

type KokoroTTS = any;
const MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";

interface VoiceInfo {
  id: string; label: string; traits: string; grade: string;
  gradeColor: string; description: string;
  accent: "American" | "British"; gender: "Female" | "Male";
}

const VOICES: VoiceInfo[] = [
  { id: "af_heart", label: "Heart", traits: "🚺❤️", grade: "A", gradeColor: "#22c55e", description: "Warm, expressive American female. The top-rated voice — natural and emotive.", accent: "American", gender: "Female" },
  { id: "af_alloy", label: "Alloy", traits: "🚺", grade: "C", gradeColor: "#f59e0b", description: "Clean American female voice. Mid-tier training.", accent: "American", gender: "Female" },
  { id: "af_aoede", label: "Aoede", traits: "🚺", grade: "C+", gradeColor: "#f59e0b", description: "American female with a smooth tone. Decent quality.", accent: "American", gender: "Female" },
  { id: "af_bella", label: "Bella", traits: "🚺🔥", grade: "A-", gradeColor: "#22c55e", description: "High-energy American female. Extensively trained, near top-tier.", accent: "American", gender: "Female" },
  { id: "af_jessica", label: "Jessica", traits: "🚺", grade: "D", gradeColor: "#ef4444", description: "American female, lower quality — minimal training data.", accent: "American", gender: "Female" },
  { id: "af_kore", label: "Kore", traits: "🚺", grade: "C+", gradeColor: "#f59e0b", description: "Balanced American female. Good for neutral narration.", accent: "American", gender: "Female" },
  { id: "af_nicole", label: "Nicole", traits: "🚺🎧", grade: "B-", gradeColor: "#84cc16", description: "ASMR-inflected American female. Soft and close-mic feel.", accent: "American", gender: "Female" },
  { id: "af_nova", label: "Nova", traits: "🚺", grade: "C", gradeColor: "#f59e0b", description: "Bright American female. Average training.", accent: "American", gender: "Female" },
  { id: "af_river", label: "River", traits: "🚺", grade: "D", gradeColor: "#ef4444", description: "American female. Limited training, lower fidelity.", accent: "American", gender: "Female" },
  { id: "af_sarah", label: "Sarah", traits: "🚺", grade: "C+", gradeColor: "#f59e0b", description: "Crisp American female. Reliable for everyday TTS.", accent: "American", gender: "Female" },
  { id: "af_sky", label: "Sky", traits: "🚺", grade: "C-", gradeColor: "#f97316", description: "Light American female. Minimal training — use sparingly.", accent: "American", gender: "Female" },
  { id: "am_adam", label: "Adam", traits: "🚹", grade: "F+", gradeColor: "#ef4444", description: "American male. Very limited training — noticeably rough.", accent: "American", gender: "Male" },
  { id: "am_echo", label: "Echo", traits: "🚹", grade: "D", gradeColor: "#ef4444", description: "American male. Low training data, inconsistent output.", accent: "American", gender: "Male" },
  { id: "am_eric", label: "Eric", traits: "🚹", grade: "D", gradeColor: "#ef4444", description: "American male. Low training, acceptable for short clips.", accent: "American", gender: "Male" },
  { id: "am_fenrir", label: "Fenrir", traits: "🚹", grade: "C+", gradeColor: "#f59e0b", description: "American male with a deeper quality. Solid for narration.", accent: "American", gender: "Male" },
  { id: "am_liam", label: "Liam", traits: "🚹", grade: "D", gradeColor: "#ef4444", description: "American male. Limited data.", accent: "American", gender: "Male" },
  { id: "am_michael", label: "Michael", traits: "🚹", grade: "C+", gradeColor: "#f59e0b", description: "American male. Well-trained, dependable voice.", accent: "American", gender: "Male" },
  { id: "am_onyx", label: "Onyx", traits: "🚹", grade: "D", gradeColor: "#ef4444", description: "American male. Limited training.", accent: "American", gender: "Male" },
  { id: "am_puck", label: "Puck", traits: "🚹", grade: "C+", gradeColor: "#f59e0b", description: "American male with a lighter tone. Decent for character voices.", accent: "American", gender: "Male" },
  { id: "am_santa", label: "Santa", traits: "🚹", grade: "D-", gradeColor: "#ef4444", description: "Novelty American male. Very minimal training — holiday fun only.", accent: "American", gender: "Male" },
  { id: "bf_alice", label: "Alice", traits: "🚺", grade: "D", gradeColor: "#ef4444", description: "British female. Recognizable accent, limited training.", accent: "British", gender: "Female" },
  { id: "bf_emma", label: "Emma", traits: "🚺", grade: "B-", gradeColor: "#84cc16", description: "British female with polished delivery. Well-trained.", accent: "British", gender: "Female" },
  { id: "bf_isabella", label: "Isabella", traits: "🚺", grade: "C", gradeColor: "#f59e0b", description: "Elegant British female. Average training.", accent: "British", gender: "Female" },
  { id: "bf_lily", label: "Lily", traits: "🚺", grade: "D", gradeColor: "#ef4444", description: "British female. Light training, lower consistency.", accent: "British", gender: "Female" },
  { id: "bm_daniel", label: "Daniel", traits: "🚹", grade: "D", gradeColor: "#ef4444", description: "British male. Limited training.", accent: "British", gender: "Male" },
  { id: "bm_fable", label: "Fable", traits: "🚹", grade: "C", gradeColor: "#f59e0b", description: "British male storyteller tone. Decent for longer reads.", accent: "British", gender: "Male" },
  { id: "bm_george", label: "George", traits: "🚹", grade: "C", gradeColor: "#f59e0b", description: "British male. Clear and measured.", accent: "British", gender: "Male" },
  { id: "bm_lewis", label: "Lewis", traits: "🚹", grade: "D+", gradeColor: "#ef4444", description: "British male. Some training, below average.", accent: "British", gender: "Male" },
];

const DTYPES = ["fp32", "fp16", "q8", "q4", "q4f16"] as const;
const DEVICES = ["wasm", "webgpu"] as const;

const DTYPE_INFO: Record<string, string> = {
  fp32: "Full 32-bit precision. Best quality, largest download (~300MB).",
  fp16: "Half-precision. Near-identical quality at half the size. Requires WebGPU.",
  q8: "8-bit quantized. Best quality/speed balance. Recommended.",
  q4: "4-bit quantized. Smaller and faster, slight quality drop.",
  q4f16: "4-bit weights + fp16 activations. Fast on WebGPU.",
};

const DEVICE_INFO: Record<string, string> = {
  wasm: "CPU via WebAssembly. Works everywhere, no special hardware needed. Slower.",
  webgpu: "GPU acceleration. Much faster. Requires Chrome 113+ with WebGPU support.",
};

function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex items-center ml-1.5 align-middle">
      <button
        onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)} onBlur={() => setShow(false)}
        className="w-4 h-4 rounded-full bg-(--surface-tertiary) text-(--text-secondary) text-[10px] font-bold flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors"
        aria-label="Info" type="button"
      >i</button>
      {show && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 px-3 py-2 rounded-lg bg-(--surface-primary) border border-(--border-primary) text-(--text-secondary) text-xs shadow-xl pointer-events-none">
          {text}
        </span>
      )}
    </span>
  );
}

function VoiceTooltip({ voice }: { voice: VoiceInfo }) {
  return (
    <div className="absolute z-50 bottom-full left-0 mb-2 w-64 px-3 py-2.5 rounded-lg bg-(--surface-primary) border border-(--border-primary) text-(--text-secondary) text-xs shadow-xl pointer-events-none">
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-(--text-primary)">{voice.label}</span>
        <span className="font-mono font-bold text-xs px-1.5 py-0.5 rounded"
          style={{ color: voice.gradeColor, background: voice.gradeColor + "22" }}>
          Grade {voice.grade}
        </span>
      </div>
      <div className="text-[11px] mb-1.5 opacity-60">{voice.accent} English · {voice.gender} {voice.traits}</div>
      <div>{voice.description}</div>
    </div>
  );
}

function AudioPlayer({ src, loading }: { src: string | null; loading: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [waveform, setWaveform] = useState<number[]>([]);
  const BAR_COUNT = 128;

  // Decode audio buffer and downsample into BAR_COUNT RMS peaks
  useEffect(() => {
    if (!src) { setWaveform([]); return; }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(src);
        const arrayBuf = await res.arrayBuffer();
        const ctx = new AudioContext();
        const audioBuf = await ctx.decodeAudioData(arrayBuf);
        await ctx.close();
        if (cancelled) return;

        const raw = audioBuf.getChannelData(0); // mono / left channel
        const blockSize = Math.floor(raw.length / BAR_COUNT);
        const peaks: number[] = [];
        for (let i = 0; i < BAR_COUNT; i++) {
          let sum = 0;
          const start = i * blockSize;
          for (let j = 0; j < blockSize; j++) sum += raw[start + j] ** 2;
          peaks.push(Math.sqrt(sum / blockSize)); // RMS
        }
        // Normalise to [0.05, 1]
        const max = Math.max(...peaks, 1e-6);
        setWaveform(peaks.map(p => Math.max(0.05, p / max)));
      } catch (e) {
        console.warn("Waveform decode failed", e);
        setWaveform([]);
      }
    })();
    return () => { cancelled = true; };
  }, [src]);

  useEffect(() => {
    if (src && audioRef.current) {
      audioRef.current.load();
      setCurrentTime(0);
      setPlaying(false);
    }
  }, [src]);

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;

  const progress = duration > 0 ? currentTime / duration : 0;

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  const togglePlay = () => {
    if (!audioRef.current || !src) return;
    playing ? audioRef.current.pause() : audioRef.current.play();
  };

  // Placeholder bars when no waveform yet
  const bars = waveform.length
    ? waveform
    : Array.from({ length: BAR_COUNT }, (_, i) =>
      Math.abs(Math.sin(i * 0.7 + 1) * 0.35 + Math.sin(i * 1.9) * 0.2) + 0.07
    );

  const isReal = waveform.length > 0;

  return (
    <div
      className={`rounded-2xl border border-(--border-primary) bg-(--surface-secondary) p-5 transition-all duration-300 ${!src && !loading ? "opacity-50" : ""
        }`}
    >
      {src && (
        <audio
          ref={audioRef}
          src={src}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => { setPlaying(false); setCurrentTime(0); }}
          onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
          preload="auto"
          className="hidden"
        />
      )}

      {/* Status line */}
      <div className="flex items-center justify-between mb-4 h-5">
        {loading ? (
          <span className="flex items-center gap-2 text-xs text-(--text-secondary)">
            <span className="inline-flex gap-[3px] items-end h-3.5">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-[3px] rounded-full bg-primary-500 animate-bounce"
                  style={{ height: "100%", animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
            Generating speech…
          </span>
        ) : src ? (
          <span className="text-xs font-medium text-(--text-tertiary) uppercase tracking-widest">
            {isReal ? "Waveform" : "Loading waveform…"}
          </span>
        ) : (
          <span className="text-xs text-(--text-tertiary)">No audio yet</span>
        )}
        <span className="text-xs font-mono tabular-nums text-(--text-tertiary)">
          {fmt(currentTime)}&thinsp;/&thinsp;{fmt(duration)}
        </span>
      </div>

      {/* Waveform canvas */}
      <div
        className="relative flex items-center gap-px h-16 mb-4 cursor-pointer select-none rounded-lg overflow-hidden px-0.5"
        onClick={handleScrub}
        title={src ? "Click to seek" : undefined}
      >
        {bars.map((h, i) => {
          const barProgress = i / BAR_COUNT;
          const played = isReal && barProgress < progress;
          const head = isReal && Math.abs(barProgress - progress) < 1 / BAR_COUNT;
          return (
            <div
              key={i}
              className="flex-1 rounded-full transition-all duration-150"
              style={{
                height: `${Math.round(h * 100)}%`,
                background: head
                  ? "var(--color-primary-400, #818cf8)"
                  : played
                    ? "var(--color-primary-500, #6366f1)"
                    : isReal
                      ? "color-mix(in srgb, var(--color-primary-500, #6366f1) 28%, var(--color-surface-tertiary, #e5e7eb))"
                      : "var(--color-surface-tertiary, #e2e8f0)",
                opacity: isReal ? 1 : 0.5,
              }}
            />
          );
        })}

        {/* Playhead needle */}
        {isReal && duration > 0 && (
          <div
            className="absolute top-0 bottom-0 w-px bg-primary-400 opacity-70 pointer-events-none"
            style={{ left: `${progress * 100}%` }}
          />
        )}
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-3">
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          disabled={!src}
          type="button"
          className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center disabled:opacity-40 hover:bg-primary-600 active:scale-95 transition-all shadow-md shrink-0"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg width="12" height="14" fill="currentColor" viewBox="0 0 12 14">
              <rect x="0.5" y="0.5" width="4" height="13" rx="1.5" />
              <rect x="7.5" y="0.5" width="4" height="13" rx="1.5" />
            </svg>
          ) : (
            <svg width="12" height="14" fill="currentColor" viewBox="0 0 12 14">
              <path d="M2 1.2l9 5.3-9 5.3V1.2z" />
            </svg>
          )}
        </button>

        {/* Seek bar (thin, below waveform as secondary scrub) */}
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.01}
          value={currentTime}
          onChange={e => {
            const t = +e.target.value;
            if (audioRef.current) audioRef.current.currentTime = t;
            setCurrentTime(t);
          }}
          disabled={!src}
          className="flex-1 h-1 accent-primary-500 cursor-pointer disabled:cursor-not-allowed rounded-full"
        />

        {/* Volume */}
        <div className="flex items-center gap-1.5 shrink-0">
          <svg width="14" height="14" fill="currentColor" className="opacity-40 shrink-0" viewBox="0 0 14 14">
            <path d="M2 5h2.5L8 2.5v9L4.5 9H2V5zm7-.5a3.5 3.5 0 010 5" strokeLinecap="round" />
          </svg>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={e => {
              const v = +e.target.value;
              if (audioRef.current) audioRef.current.volume = v;
              setVolume(v);
            }}
            className="w-16 h-1 accent-primary-500 cursor-pointer"
          />
        </div>

        {/* Download */}
        {src && (
          <a
            href={src}
            download="kokoro-speech.wav"
            title="Download audio"
            className="p-2 rounded-lg hover:bg-(--surface-tertiary) text-(--text-tertiary) hover:text-(--text-primary) transition-colors shrink-0"
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6"
              strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 15 15">
              <path d="M7.5 2v8M4.5 7.5l3 3 3-3M2.5 12.5h10" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

// Float32 PCM → 16-bit WAV
function encodeWAV(samples: Float32Array, sampleRate: number): ArrayBuffer {
  const buf = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buf);
  const s = (o: number, v: string) => { for (let i = 0; i < v.length; i++) view.setUint8(o + i, v.charCodeAt(i)); };
  s(0, "RIFF"); view.setUint32(4, 36 + samples.length * 2, true);
  s(8, "WAVE"); s(12, "fmt ");
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  s(36, "data"); view.setUint32(40, samples.length * 2, true);
  for (let i = 0, o = 44; i < samples.length; i++, o += 2) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(o, v < 0 ? v * 0x8000 : v * 0x7fff, true);
  }
  return buf;
}

export default function KokoroTool() {
  const [text, setText] = useState("Knicknaks uses Kokoro to generate speech in your browser! How cool is that?");
  const [voice, setVoice] = useState("af_heart");
  const [dtype, setDtype] = useState<typeof DTYPES[number]>("q8");
  const [device, setDevice] = useState<typeof DEVICES[number]>("wasm");
  const [loading, setLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [voiceHover, setVoiceHover] = useState(false);

  const ttsRef = useRef<KokoroTTS | null>(null);
  const prevUrlRef = useRef<string | null>(null);
  const selectedVoice = VOICES.find(v => v.id === voice)!;

  async function loadModel() {
    if (ttsRef.current) return ttsRef.current;
    setLoading(true); setError(null);
    try {
      const { KokoroTTS } = await import("kokoro-js");
      const instance = await KokoroTTS.from_pretrained(MODEL_ID, {
        dtype, device,
        progress_callback: (p: any) => { if (p?.progress != null) setProgress(Math.round(p.progress)); },
      });
      ttsRef.current = instance; setModelReady(true); return instance;
    } catch (err) { setError("Failed to load model."); throw err; }
    finally { setLoading(false); setProgress(null); }
  }

  async function handleGenerate() {
    if (!text.trim()) return;
    setError(null);
    setGenerating(true);

    try {
      const tts = await loadModel();

      // Use generate() directly — returns a single AudioOutput with .audio and .sampling_rate
      const output = await tts.generate(text, { voice });

      const pcm: Float32Array = output.audio;
      const sampleRate: number = output.sampling_rate ?? tts.sample_rate ?? 24000;

      const wav = encodeWAV(pcm, sampleRate);
      const blob = new Blob([wav], { type: "audio/wav" });

      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
      const url = URL.createObjectURL(blob);
      prevUrlRef.current = url;
      setAudioSrc(url);

    } catch (err) {
      console.error(err);
      setError("Failed to generate speech.");
    } finally {
      setGenerating(false);
    }
  }

  const resetModel = () => { ttsRef.current = null; setModelReady(false); };
  const busy = loading || generating;

  return (
    <div className="space-y-6">
      <Panel>
        <div className="space-y-4">
          <Input label="Text" value={text}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
            placeholder="Enter text to speak…" />

          <div>
            <label className="text-sm font-medium text-(--text-primary) flex items-center">
              Voice
              <InfoTooltip text="Choose a speaker. Grades (A-F) reflect audio quality based on training data. Hover the dropdown to see info on the selected voice." />
            </label>
            <div className="relative mt-1" onMouseEnter={() => setVoiceHover(true)} onMouseLeave={() => setVoiceHover(false)}>
              <select value={voice} onChange={e => setVoice(e.target.value)}
                className="w-full p-2 rounded-md bg-(--surface-secondary) cursor-pointer">
                <optgroup label="🇺🇸 American — Female">
                  {VOICES.filter(v => v.accent === "American" && v.gender === "Female").map(v => <option key={v.id} value={v.id}>{v.label} · {v.grade}</option>)}
                </optgroup>
                <optgroup label="🇺🇸 American — Male">
                  {VOICES.filter(v => v.accent === "American" && v.gender === "Male").map(v => <option key={v.id} value={v.id}>{v.label} · {v.grade}</option>)}
                </optgroup>
                <optgroup label="🇬🇧 British — Female">
                  {VOICES.filter(v => v.accent === "British" && v.gender === "Female").map(v => <option key={v.id} value={v.id}>{v.label} · {v.grade}</option>)}
                </optgroup>
                <optgroup label="🇬🇧 British — Male">
                  {VOICES.filter(v => v.accent === "British" && v.gender === "Male").map(v => <option key={v.id} value={v.id}>{v.label} · {v.grade}</option>)}
                </optgroup>
              </select>
              {voiceHover && <VoiceTooltip voice={selectedVoice} />}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-(--text-primary) flex items-center">
              Precision <InfoTooltip text={DTYPE_INFO[dtype]} />
            </label>
            <select value={dtype} onChange={e => { setDtype(e.target.value as any); resetModel(); }}
              className="w-full mt-1 p-2 rounded-md bg-(--surface-secondary)">
              {DTYPES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-(--text-primary) flex items-center">
              Device <InfoTooltip text={DEVICE_INFO[device]} />
            </label>
            <select value={device} onChange={e => { setDevice(e.target.value as any); resetModel(); }}
              className="w-full mt-1 p-2 rounded-md bg-(--surface-secondary)">
              <option value="wasm">CPU (WebAssembly)</option>
              <option value="webgpu">GPU (WebGPU)</option>
            </select>
          </div>

          <button onClick={handleGenerate} disabled={busy} type="button"
            className="px-4 py-2 rounded-md bg-primary-500 text-white disabled:opacity-50 font-medium hover:bg-primary-600 active:scale-[0.98] transition-all">
            {loading ? `Loading model… ${progress != null ? progress + "%" : ""}` :
              generating ? "Generating…" : modelReady ? "Generate Speech" : "Load & Generate"}
          </button>

          {progress !== null && (
            <div className="w-full bg-(--surface-secondary) rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-primary-500 transition-all duration-300 rounded-full" style={{ width: `${progress}%` }} />
            </div>
          )}
          {error && <div className="text-sm text-red-500">{error}</div>}
        </div>
      </Panel>

      <Panel>
        <p className="text-xs text-(--text-tertiary) mb-3 font-medium uppercase tracking-wide">Output</p>
        <AudioPlayer src={audioSrc} loading={generating} />
      </Panel>

      <Panel>
        <div className="text-sm text-(--text-secondary) space-y-1">
          <p>• Model downloads once and is cached in your browser.</p>
          <p>• All speech is generated locally — nothing is sent to a server.</p>
          <p>• WebGPU is significantly faster if your browser supports it.</p>
        </div>
      </Panel>
    </div>
  );
}