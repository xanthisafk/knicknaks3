import { useEffect, useRef, useState } from "react";
import { DEVICE_INFO, DTYPE_INFO, DTYPES, VOICES, type Device, type DType, type GenerationState } from "./types";
import { Container } from "@/components/layout/Primitive";
import { Panel } from "@/components/layout";
import { Button, Emoji, Label, ProgressBar, Textarea } from "@/components/ui";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from "@/components/ui/select";
import { VoiceOption } from "./VoiceOption";
import { VoiceDetails } from "./VoiceDetails";
import { AudioPlayer } from "./AudioPlayer";
import { TriangleAlert } from "lucide-react";
import { useToast } from "@/hooks/useToast";

export default function KokoroTool() {
  // — State —
  const [text, setText] = useState(
    "Knicknaks uses Kokoro to generate speech in your browser! How cool is that?"
  );
  const [voiceId, setVoiceId] = useState<string>("af_heart");
  const [dtype, setDtype] = useState<DType>("q8");
  const [device, setDevice] = useState<Device>("wasm");
  const [genState, setGenState] = useState<GenerationState>({
    status: "idle",
    progress: null,
    errorMessage: null,
  });
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  // — Refs —
  const prevUrlRef = useRef<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  // - Hooks -
  const toast = useToast();

  // — Derived —
  const selectedVoice = VOICES.find(v => v.id === voiceId) ?? VOICES[0];
  const isBusy = genState.status === "loading-model" || genState.status === "generating";

  // - Load worker - 
  useEffect(() => {
    workerRef.current = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });

    workerRef.current.onmessage = (e) => {
      const { type } = e.data;

      if (type === "PROGRESS") {
        setGenState(s => ({ ...s, progress: e.data.progress }));
      }

      if (type === "READY") {
        setGenState({ status: "ready", progress: null, errorMessage: null });
        toast.success("Model loaded!");
      }

      if (type === "RESULT") {
        const blob = new Blob([e.data.wav], { type: "audio/wav" });

        if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
        const url = URL.createObjectURL(blob);
        prevUrlRef.current = url;

        setAudioSrc(url);
        setGenState({ status: "ready", progress: null, errorMessage: null });
        toast.success("Speech generated!");
      }

      if (type === "ERROR") {
        setGenState({ status: "error", progress: null, errorMessage: e.data.message });
        toast.error(e.data.message, 10);
      }
    };

    return () => workerRef.current?.terminate();
  }, []);

  // — Model loading —
  async function ensureModel() {
    if (!workerRef.current) return;

    setGenState({ status: "loading-model", progress: 0, errorMessage: null });

    workerRef.current.postMessage({
      type: "INIT",
      payload: { dtype, device }
    });
  }

  // — Generation —
  async function handleGenerate() {
    if (!text.trim() || isBusy || !workerRef.current) return;

    if (genState.status === "idle") {
      await ensureModel();
      return;
    }

    setGenState({ status: "generating", progress: null, errorMessage: null });

    workerRef.current.postMessage({
      type: "GENERATE",
      payload: { text, voiceId }
    });
  }

  // Reset model when dtype/device changes
  function resetModel() {
    workerRef.current?.terminate();
    workerRef.current = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
    setGenState(s => ({ ...s, status: "idle" }));
  }

  const buttonLabel = (() => {
    switch (genState.status) {
      case "loading-model": return genState.progress != null ? `Loading… ${genState.progress}%` : "Loading model…";
      case "generating": return "Generating…";
      case "ready": return "Generate Speech";
      default: return "Load Model";
    }
  })();

  return (
    <Container>
      <Panel>
        <Textarea
          label="Text to speak"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to speak..."
          handlePaste={setText}
        />
        <div>
          <Select label="Voice" value={voiceId} onValueChange={setVoiceId}>
            <SelectTrigger>
              {/* {VOICES.find(v => v.id === voiceId)?.label} */}
              <VoiceOption voice={selectedVoice} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel><Emoji>🇺🇸</Emoji> American</SelectLabel>
                {VOICES.filter(v => v.accent === "American").map(v => (
                  <SelectItem key={v.id} value={v.id}>
                    <VoiceOption voice={v} />
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel><Emoji>🇬🇧</Emoji> British</SelectLabel>
                {VOICES.filter(v => v.accent === "British").map(v => (
                  <SelectItem key={v.id} value={v.id}>
                    <VoiceOption voice={v} />
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Label size="xs">Grades (A-F) reflect quality based on training data amount. Higher grade = more natural output.</Label>

          {/* Voice detail card */}
          <div className="mt-2">
            <VoiceDetails voice={selectedVoice} />
          </div>

        </div>

        {/* Precision */}
        <div>
          <Select
            label="Precision"
            value={dtype}
            onValueChange={v => { setDtype(v as DType); resetModel(); }}
          >
            <SelectTrigger>
              {dtype.toUpperCase()}
            </SelectTrigger>
            <SelectContent>
              {DTYPES.map(d => (
                <SelectItem key={d} value={d}>{d.toUpperCase()}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Label size="xs">{DTYPE_INFO[dtype]}</Label>
        </div>

        {/* Device */}
        <div>
          <Select
            label="Device"
            value={device}
            onValueChange={v => { setDevice(v as Device); resetModel(); }}
          >
            <SelectTrigger>
              {device === "wasm" ? "CPU (WebAssembly)" : "GPU (WebGPU)"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wasm">CPU (WebAssembly)</SelectItem>
              <SelectItem value="webgpu">GPU (WebGPU)</SelectItem>
            </SelectContent>
          </Select>
          <Label size="xs">{DEVICE_INFO[device]}</Label>
        </div>

        {/* Generate button */}
        <Button
          variant="primary"
          onClick={handleGenerate}
          disabled={isBusy || !text.trim()}
          className="w-full"
        >{buttonLabel}</Button>

        {/* Download progress bar */}
        {genState.status === "loading-model" && genState.progress != null && (
          <ProgressBar
            value={genState.progress}
            max={100}
            variant="primary"
            size="s"
            showLabel
            label="Downloading model"
          />
        )}

        {/* Error message */}
        {(genState.status === "error" && genState.errorMessage) && (
          <Label variant="danger" icon={TriangleAlert}>{genState.errorMessage}</Label>
        )}
      </Panel>

      {/* ── Right Panel: Output ── */}
      {audioSrc &&
        <Panel>
          <Label>Output</Label>
          <AudioPlayer
            src={audioSrc}
            loading={genState.status === "generating"}
          />
        </Panel>
      }
    </Container>
  );
}