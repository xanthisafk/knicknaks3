import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Panel } from "@/components/layout/Layout";
import { Select } from "@/components/ui/select/Select";
import { SelectTrigger } from "@/components/ui/select/SelectTrigger";
import { SelectContent } from "@/components/ui/select/SelectContent";
import { SelectItem } from "@/components/ui/select/SelectItem";
import { Toggle } from "@/components/ui/Toggle";
import { ProgressBar } from "@/components/ui/ProgressBar";

// ─── Types ────────────────────────────────────────────────────────────────────

// countdown-pre  = 3-2-1 shown BEFORE getDisplayMedia (user still on our tab)
// countdown-post = 1s pause AFTER getDisplayMedia resolves (user may have switched tabs)
// recording / paused / done = self-explanatory
type RecordingState =
    | "idle"
    | "countdown-pre"
    | "countdown-post"
    | "recording"
    | "paused"
    | "done";

type MicPermission = "unknown" | "asking" | "granted" | "denied";
// type WebcamCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right"; // TODO: webcam

interface MicDevice {
    deviceId: string;
    label: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0)
        return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function defaultFilename(): string {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `knicknaks-recording-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

function bestMimeType(): string {
    const candidates = [
        "video/mp4;codecs=avc1",
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm",
    ];
    return candidates.find((t) => MediaRecorder.isTypeSupported(t)) ?? "video/webm";
}

/** Sleep helper for the post-getDisplayMedia 1s pause */
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const FPS_OPTIONS = ["15", "24", "30", "60"];

// ─── Web Audio mixer ─────────────────────────────────────────────────────────
//
// Problem: MediaRecorder only encodes the *first* audio track it finds when
// you pass a stream with multiple audio tracks. Chrome silently drops the rest.
//
// Fix: route every audio source through the Web Audio API into a single
// MediaStreamAudioDestinationNode, then hand that one merged track (plus the
// original video track) to MediaRecorder.
//
// Important implementation notes:
//   - We wrap each source in its own GainNode (gain=1). This forces Chrome to
//     keep the node graph alive; a bare createMediaStreamSource→dest connection
//     can get garbage-collected before recording ends.
//   - The AudioContext must stay open for the entire recording duration.
//     The caller stores it in audioCtxRef and closes it in recorder.onstop.
//   - We build the MediaStream from [videoTracks..., dest.stream.audioTrack].
//     Do NOT spread dest.stream itself — its track list may be empty initially.
//
function mixAudioStreams(
    screenStream: MediaStream,
    micStream: MediaStream | null
): { mixed: MediaStream; audioCtx: AudioContext } {
    const audioCtx = new AudioContext();
    const dest = audioCtx.createMediaStreamDestination();

    const screenAudioTracks = screenStream.getAudioTracks();
    if (screenAudioTracks.length > 0) {
        const gain = audioCtx.createGain();
        gain.gain.value = 1;
        const src = audioCtx.createMediaStreamSource(new MediaStream(screenAudioTracks));
        src.connect(gain);
        gain.connect(dest);
    }

    if (micStream) {
        const micAudioTracks = micStream.getAudioTracks();
        if (micAudioTracks.length > 0) {
            const gain = audioCtx.createGain();
            gain.gain.value = 1;
            const src = audioCtx.createMediaStreamSource(new MediaStream(micAudioTracks));
            src.connect(gain);
            gain.connect(dest);
        }
    }

    // dest.stream.getAudioTracks() is guaranteed to have exactly one track
    const mixed = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...dest.stream.getAudioTracks(),
    ]);

    return { mixed, audioCtx };
}

// ─── Post-recording canvas compositor ────────────────────────────────────────
//
// Composites screen + webcam videos together by seeking both frame-by-frame,
// drawing onto an OffscreenCanvas (falls back to regular Canvas), and
// encoding via MediaRecorder on canvas.captureStream().
//
// Returns a Promise<Blob> so callers can await it and show progress.
//
async function compositeVideos(
    screenBlob: Blob,
    webcamBlob: Blob,
    webcamCorner: "top-left" | "top-right" | "bottom-left" | "bottom-right",
    mimeType: string,
    onProgress: (pct: number) => void
): Promise<Blob> {
    // Load both videos into HTMLVideoElements so we can seek them
    const makeVideo = (blob: Blob): Promise<HTMLVideoElement> =>
        new Promise((resolve, reject) => {
            const v = document.createElement("video");
            v.src = URL.createObjectURL(blob);
            v.muted = true;
            v.preload = "auto";
            v.onloadedmetadata = () => resolve(v);
            v.onerror = reject;
        });

    const [screenVid, webcamVid] = await Promise.all([
        makeVideo(screenBlob),
        makeVideo(webcamBlob),
    ]);

    const W = screenVid.videoWidth;
    const H = screenVid.videoHeight;
    const duration = screenVid.duration; // seconds

    // Webcam PiP dimensions: 20% of width, capped at 320px
    const pipW = Math.min(Math.round(W * 0.2), 320);
    const pipH = Math.round(pipW * (webcamVid.videoHeight / webcamVid.videoWidth));
    const margin = Math.round(W * 0.015);

    const cornerPos = (): { x: number; y: number } => {
        if (webcamCorner === "top-left") return { x: margin, y: margin };
        if (webcamCorner === "top-right") return { x: W - pipW - margin, y: margin };
        if (webcamCorner === "bottom-left") return { x: margin, y: H - pipH - margin };
        return { x: W - pipW - margin, y: H - pipH - margin };
    };

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // We'll step through at 30fps intervals regardless of source fps
    const FPS = 30;
    const frameMs = 1000 / FPS;
    const totalFrames = Math.ceil(duration * FPS);

    // Record the canvas stream
    const canvasStream = canvas.captureStream(FPS);

    // Mix in the screen audio from the original blob
    // (webcam was recorded without audio, so just screen audio here)
    const audioCtx = new AudioContext();
    const audioDest = audioCtx.createMediaStreamDestination();
    const audioEl = document.createElement("audio");
    audioEl.src = URL.createObjectURL(screenBlob);
    audioEl.muted = false;
    const audioSrc = audioCtx.createMediaElementSource(audioEl);
    audioSrc.connect(audioDest);

    const outStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioDest.stream.getAudioTracks(),
    ]);

    const chunks: Blob[] = [];
    const rec = new MediaRecorder(outStream, { mimeType });
    rec.ondataavailable = (e) => { if (e.data?.size > 0) chunks.push(e.data); };

    // Wrap the recording loop in a promise
    const donePromise = new Promise<Blob>((resolve) => {
        rec.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
    });

    rec.start();
    audioEl.play();

    for (let frame = 0; frame < totalFrames; frame++) {
        const t = frame / FPS;

        // Seek both videos to this timestamp
        await seekVideo(screenVid, t);
        await seekVideo(webcamVid, Math.min(t, webcamVid.duration));

        // Draw frame
        ctx.drawImage(screenVid, 0, 0, W, H);

        // Webcam pip with rounded corners via clipping
        const { x, y } = cornerPos();
        const r = Math.round(pipW * 0.07);
        ctx.save();
        roundedRect(ctx, x, y, pipW, pipH, r);
        ctx.clip();
        ctx.drawImage(webcamVid, x, y, pipW, pipH);
        ctx.restore();

        // Thin border around pip
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.lineWidth = 2;
        roundedRect(ctx, x, y, pipW, pipH, r);
        ctx.stroke();

        onProgress(Math.round(((frame + 1) / totalFrames) * 100));

        // Yield to browser to avoid freezing the tab
        await sleep(frameMs * 0.6);
    }

    rec.stop();
    audioEl.pause();
    audioCtx.close();

    return donePromise;
}

/** Seek a video element to a specific time and wait for it to be ready */
function seekVideo(video: HTMLVideoElement, time: number): Promise<void> {
    return new Promise((resolve) => {
        if (Math.abs(video.currentTime - time) < 0.001) { resolve(); return; }
        video.onseeked = () => resolve();
        video.currentTime = time;
    });
}

/** Draw a rounded rect path (no fill, just path) */
function roundedRect(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number, r: number
) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ScreenRecorderTool() {
    // State machine
    const [state, setState] = useState<RecordingState>("idle");
    const [countdown, setCountdown] = useState(3);

    // Settings
    const [fps, setFps] = useState("30");
    const [filename, setFilename] = useState(defaultFilename);

    // Mic
    const [micPermission, setMicPermission] = useState<MicPermission>("unknown");
    const [includeMic, setIncludeMic] = useState(false);
    const [micDevices, setMicDevices] = useState<MicDevice[]>([]);
    const [selectedMic, setSelectedMic] = useState<string>("");

    // TODO: Webcam — commented out until compositing is fully wired up
    // const [includeWebcam, setIncludeWebcam] = useState(false);
    // const [webcamCorner, setWebcamCorner]   = useState<WebcamCorner>("bottom-right");
    // const [webcamReady, setWebcamReady]     = useState(false);
    // const webcamVideoRef    = useRef<HTMLVideoElement>(null);
    // const webcamStreamRef   = useRef<MediaStream | null>(null);
    // const webcamRecorderRef = useRef<MediaRecorder | null>(null);
    // const webcamChunksRef   = useRef<Blob[]>([]);
    // const [webcamBlobUrl, setWebcamBlobUrl] = useState<string | null>(null);
    // const [webcamBlob, setWebcamBlob]       = useState<Blob | null>(null);

    // Recording refs
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const micStreamRef = useRef<MediaStream | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef(0);
    const pauseOffsetRef = useRef(0);
    const mimeTypeRef = useRef("video/webm");

    // Output state
    const [elapsed, setElapsed] = useState(0);
    const [recordedSize, setRecordedSize] = useState(0);
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [screenBlob, setScreenBlob] = useState<Blob | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Compositing
    const [compositing, setCompositing] = useState(false);
    const [compositePct, setCompositePct] = useState(0);
    const [compositeBlobUrl, setCompositeBlobUrl] = useState<string | null>(null);

    // Preview aspect ratio — eliminates letterbox bar
    const previewVideoRef = useRef<HTMLVideoElement>(null);
    const [videoAspect, setVideoAspect] = useState("16 / 9");

    // ── Cleanup on unmount ──────────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            streamRef.current?.getTracks().forEach((t) => t.stop());
            micStreamRef.current?.getTracks().forEach((t) => t.stop());
            audioCtxRef.current?.close();
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // ── Mic permission ──────────────────────────────────────────────────────────
    const requestMicPermission = useCallback(async () => {
        setMicPermission("asking");
        try {
            const tmp = await navigator.mediaDevices.getUserMedia({ audio: true });
            tmp.getTracks().forEach((t) => t.stop());
            const all = await navigator.mediaDevices.enumerateDevices();
            const mics: MicDevice[] = all
                .filter((d) => d.kind === "audioinput")
                .map((d, i) => ({ deviceId: d.deviceId, label: d.label || `Microphone ${i + 1}` }));
            setMicDevices(mics);
            if (mics.length > 0) setSelectedMic(mics[0].deviceId);
            setMicPermission("granted");
        } catch {
            setMicPermission("denied");
            setIncludeMic(false);
        }
    }, []);

    const handleToggleMic = async (checked: boolean) => {
        setIncludeMic(checked);
        if (checked && micPermission !== "granted") {
            await requestMicPermission();
        }
    };

    // ── Core recording kickoff ──────────────────────────────────────────────────
    const startActualRecording = useCallback(
        (screenStream: MediaStream, micStream: MediaStream | null) => {
            const mime = bestMimeType();
            mimeTypeRef.current = mime;

            // Mix both audio sources via Web Audio API to avoid MediaRecorder
            // silently discarding one track when two audio tracks are present.
            const { mixed, audioCtx } = mixAudioStreams(screenStream, micStream);
            audioCtxRef.current = audioCtx;

            const recorder = new MediaRecorder(mixed, { mimeType: mime });
            mediaRecorderRef.current = recorder;
            chunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data?.size > 0) {
                    chunksRef.current.push(e.data);
                    setRecordedSize((prev) => prev + e.data.size);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: mime });
                setScreenBlob(blob);
                setBlobUrl(URL.createObjectURL(blob));
                setState("done");
                streamRef.current?.getTracks().forEach((t) => t.stop());
                micStreamRef.current?.getTracks().forEach((t) => t.stop());
                audioCtxRef.current?.close();
                if (timerRef.current) clearInterval(timerRef.current);
            };

            // User ended share from browser chrome
            screenStream.getVideoTracks()[0].addEventListener("ended", () => {
                if (recorder.state !== "inactive") recorder.stop();
            });

            recorder.start(1000);
            setState("recording");
            startTimeRef.current = Date.now();
            pauseOffsetRef.current = 0;

            timerRef.current = setInterval(() => {
                setElapsed(
                    Math.floor((Date.now() - startTimeRef.current + pauseOffsetRef.current) / 1000)
                );
            }, 500);
        },
        []
    );

    // ── Start flow: countdown → getDisplayMedia → 1s pause → record ────────────
    //
    // Order matters:
    //   1. Show 3-2-1 countdown while user is still on *our* tab
    //   2. Call getDisplayMedia (browser opens picker, user may switch tabs)
    //   3. Wait 1 extra second so user can see "Recording starts in 1…" before we go
    //   4. Start MediaRecorder
    //
    const startRecording = async () => {
        setError(null);
        setBlobUrl(null);
        setScreenBlob(null);
        setCompositeBlobUrl(null);
        setRecordedSize(0);
        setElapsed(0);

        // Phase 1: pre-getDisplayMedia countdown (3 → 1), user still on our tab
        setState("countdown-pre");
        setCountdown(3);
        for (let i = 3; i >= 1; i--) {
            setCountdown(i);
            await sleep(1000);
        }

        // Phase 2: open the browser screen picker
        let screenStream: MediaStream;
        try {
            screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: { frameRate: { ideal: parseInt(fps), max: parseInt(fps) } },
                audio: true,
            });
        } catch (err: unknown) {
            setState("idle");
            if (err instanceof Error && err.name === "NotAllowedError") {
                setError("Screen share permission denied. Please allow screen access and try again.");
            } else {
                setError("Could not start recording. Your browser may not support the Screen Capture API.");
            }
            return;
        }
        streamRef.current = screenStream;

        // Phase 3: post-getDisplayMedia 1s pause (user may have switched tabs;
        // show "Starting…" so they know something is happening if they switch back)
        setState("countdown-post");
        await sleep(1000);

        // Phase 4: get mic if requested
        let micStream: MediaStream | null = null;
        if (includeMic && micPermission === "granted" && selectedMic) {
            try {
                micStream = await navigator.mediaDevices.getUserMedia({
                    audio: { deviceId: { exact: selectedMic } },
                });
                micStreamRef.current = micStream;
            } catch {
                // Mic failed silently — recording proceeds without it
            }
        }

        startActualRecording(screenStream, micStream);
    };

    // ── Pause / Resume / Stop ───────────────────────────────────────────────────
    const pauseRecording = () => {
        const rec = mediaRecorderRef.current;
        if (!rec || rec.state !== "recording") return;
        rec.pause();
        pauseOffsetRef.current += Date.now() - startTimeRef.current;
        if (timerRef.current) clearInterval(timerRef.current);
        setState("paused");
    };

    const resumeRecording = () => {
        const rec = mediaRecorderRef.current;
        if (!rec || rec.state !== "paused") return;
        rec.resume();
        startTimeRef.current = Date.now();
        timerRef.current = setInterval(() => {
            setElapsed(
                Math.floor((Date.now() - startTimeRef.current + pauseOffsetRef.current) / 1000)
            );
        }, 500);
        setState("recording");
    };

    const stopRecording = () => {
        const rec = mediaRecorderRef.current;
        if (!rec || rec.state === "inactive") return;
        rec.stop();
        if (timerRef.current) clearInterval(timerRef.current);
    };

    // ── Download helpers ────────────────────────────────────────────────────────
    const ext = mimeTypeRef.current.includes("mp4") ? "mp4" : "webm";

    const triggerDownload = (url: string, name: string) => {
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        a.click();
    };

    const downloadRecording = () => {
        if (!blobUrl) return;
        triggerDownload(blobUrl, `${filename.trim() || defaultFilename()}.${ext}`);
    };

    const downloadComposed = () => {
        if (!compositeBlobUrl) return;
        triggerDownload(compositeBlobUrl, `${filename.trim() || defaultFilename()}-composed.${ext}`);
    };

    // ── Compositing (for when webcam is re-enabled) ─────────────────────────────
    // TODO: uncomment + wire up once webcam recording is re-enabled
    // const handleComposite = async () => {
    //   if (!screenBlob || !webcamBlob) return;
    //   setCompositing(true);
    //   setCompositePct(0);
    //   try {
    //     const result = await compositeVideos(
    //       screenBlob,
    //       webcamBlob,
    //       webcamCorner,
    //       mimeTypeRef.current,
    //       setCompositePct
    //     );
    //     setCompositeBlobUrl(URL.createObjectURL(result));
    //   } catch (e) {
    //     setError("Compositing failed. Try downloading separately.");
    //   } finally {
    //     setCompositing(false);
    //   }
    // };

    // ── Reset ───────────────────────────────────────────────────────────────────
    const reset = () => {
        if (blobUrl) URL.revokeObjectURL(blobUrl);
        if (compositeBlobUrl) URL.revokeObjectURL(compositeBlobUrl);
        setBlobUrl(null);
        setScreenBlob(null);
        setCompositeBlobUrl(null);
        setElapsed(0);
        setRecordedSize(0);
        setError(null);
        setFilename(defaultFilename());
        setState("idle");
        chunksRef.current = [];
    };

    // ── Preview aspect ratio ────────────────────────────────────────────────────
    const handlePreviewMetadata = () => {
        const v = previewVideoRef.current;
        if (v?.videoWidth && v.videoHeight) {
            setVideoAspect(`${v.videoWidth} / ${v.videoHeight}`);
        }
    };

    const isActive = state === "recording" || state === "paused";
    const isCountdown = state === "countdown-pre" || state === "countdown-post";

    // ─── Render ──────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-4">

            {/* ── IDLE ──────────────────────────────────────────────────────────── */}
            {state === "idle" && (
                <Panel>
                    <div className="space-y-5">
                        <div>
                            <h2
                                className="text-base font-semibold mb-0.5"
                                style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}
                            >
                                Screen Recorder
                            </h2>
                            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                                Captures your screen entirely in the browser. Nothing ever leaves your device.
                            </p>
                        </div>

                        {/* FPS */}
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium min-w-28" style={{ color: "var(--text-primary)" }}>
                                Frame Rate
                            </label>
                            <Select value={fps} onValueChange={setFps}>
                                <SelectTrigger className="w-28">
                                    <span>{fps} FPS</span>
                                </SelectTrigger>
                                <SelectContent>
                                    {FPS_OPTIONS.map((f) => (
                                        <SelectItem key={f} value={f}>{f} FPS</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* ── Mic ─────────────────────────────────────────────────────── */}
                        <div className="space-y-3">
                            <Toggle
                                checked={includeMic}
                                onChange={(e) => handleToggleMic(e)}
                                label="Include Microphone Audio"
                            />

                            {includeMic && (
                                <div className="pl-1 space-y-2">
                                    {micPermission === "asking" && (
                                        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                                            Requesting microphone access…
                                        </p>
                                    )}

                                    {micPermission === "denied" && (
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <p className="text-sm" style={{ color: "var(--color-danger-600)" }}>
                                                    🎤 Permission denied.
                                                </p>
                                                <Button variant="secondary" size="xs" onClick={requestMicPermission}>
                                                    Grant Permission
                                                </Button>
                                            </div>
                                            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                                                Recording will proceed without mic audio.
                                            </p>
                                        </div>
                                    )}

                                    {micPermission === "granted" && micDevices.length > 0 && (
                                        <div className="flex items-center gap-3">
                                            <label className="text-sm font-medium min-w-28" style={{ color: "var(--text-primary)" }}>
                                                Microphone
                                            </label>
                                            <Select value={selectedMic} onValueChange={setSelectedMic}>
                                                <SelectTrigger className="flex-1 max-w-xs">
                                                    {/*
                            SelectValue renders its `value` prop as a fallback,
                            which would show the raw deviceId hex string.
                            Instead, look up the human-readable label ourselves.
                          */}
                                                    <span className="truncate">
                                                        {micDevices.find((d) => d.deviceId === selectedMic)?.label ?? "Select mic"}
                                                    </span>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {micDevices.map((d) => (
                                                        <SelectItem key={d.deviceId} value={d.deviceId}>
                                                            {d.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ── Webcam — TODO ────────────────────────────────────────────── */}
                        {/* Webcam toggle is disabled until post-recording compositor is
                fully wired up. When re-enabled, the compositor will combine
                the screen and webcam recordings client-side and offer three
                download options: composed, screen-only, webcam-only.       */}

                        {error && (
                            <p
                                className="text-sm rounded-md px-3 py-2"
                                style={{ color: "var(--color-danger-600)", background: "var(--color-danger-50)" }}
                            >
                                ⚠️ {error}
                            </p>
                        )}

                        <div className="pt-1">
                            <Button variant="primary" emoji="🔴" size="md" onClick={startRecording}>
                                Start Recording
                            </Button>
                        </div>

                        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                            💡 A 3-second countdown will run, then a screen picker appears. Recording begins 1 second after you pick a source.
                        </p>
                    </div>
                </Panel>
            )}

            {/* ── COUNTDOWN (pre & post getDisplayMedia) ────────────────────────── */}
            {isCountdown && (
                <Panel>
                    <div className="flex flex-col items-center justify-center py-10 gap-4">
                        {state === "countdown-pre" ? (
                            <>
                                <p className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>
                                    Get ready — recording starts in…
                                </p>
                                <span
                                    key={countdown}
                                    className="text-8xl font-bold tabular-nums"
                                    style={{
                                        fontFamily: "var(--font-heading)",
                                        color: "var(--color-primary-500)",
                                        display: "block",
                                        animation: "countdown-pop 0.95s var(--ease-out) forwards",
                                    }}
                                >
                                    {countdown}
                                </span>
                                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                                    Pick your screen source when prompted…
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>
                                    Starting…
                                </p>
                                <span
                                    className="text-4xl"
                                    style={{ animation: "spin 0.8s linear infinite", display: "inline-block" }}
                                >
                                    🎬
                                </span>
                                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                                    Recording begins in a moment
                                </p>
                            </>
                        )}
                    </div>
                </Panel>
            )}

            {/* ── ACTIVE HUD ────────────────────────────────────────────────────── */}
            {isActive && (
                <Panel>
                    <div className="space-y-5">
                        <div className="flex flex-wrap items-center gap-3">
                            <span
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
                                style={{
                                    background: state === "recording" ? "var(--color-danger-50)" : "var(--color-warning-50)",
                                    color: state === "recording" ? "var(--color-danger-600)" : "var(--color-warning-600)",
                                }}
                            >
                                <span
                                    className="w-2 h-2 rounded-full"
                                    style={{
                                        background: state === "recording" ? "var(--color-danger-500)" : "var(--color-warning-500)",
                                        animation: state === "recording" ? "rec-pulse 1.4s ease-in-out infinite" : "none",
                                    }}
                                />
                                {state === "recording" ? "Recording" : "Paused"}
                            </span>

                            <span
                                className="text-2xl font-semibold tabular-nums"
                                style={{ color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}
                            >
                                {formatDuration(elapsed)}
                            </span>

                            <span className="text-sm ml-auto" style={{ color: "var(--text-tertiary)" }}>
                                {formatBytes(recordedSize)}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {state === "recording"
                                ? <Button variant="secondary" emoji="⏸️" onClick={pauseRecording}>Pause</Button>
                                : <Button variant="secondary" emoji="▶️" onClick={resumeRecording}>Resume</Button>
                            }
                            <Button variant="danger" emoji="⏹️" onClick={stopRecording}>Stop & Save</Button>
                        </div>

                        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                            🖥️ Native resolution · {fps} FPS target
                            {includeMic && micPermission === "granted" ? " · 🎤 Mic + screen audio mixed" : ""}
                        </p>
                    </div>
                </Panel>
            )}

            {/* ── COMPOSITING PROGRESS ──────────────────────────────────────────── */}
            {compositing && (
                <Panel>
                    <div className="space-y-3">
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                            🎞️ Compositing webcam onto recording…
                        </p>
                        <ProgressBar value={compositePct} max={100} variant="success" showLabel />
                        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                            This runs locally in your browser. It may take a minute for longer recordings.
                        </p>
                    </div>
                </Panel>
            )}

            {/* ── DONE ──────────────────────────────────────────────────────────── */}
            {state === "done" && blobUrl && (
                <Panel>
                    <div className="space-y-4">
                        <div>
                            <h2
                                className="text-base font-semibold mb-0.5"
                                style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}
                            >
                                Recording Complete ✅
                            </h2>
                            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                                {formatDuration(elapsed)} · {formatBytes(recordedSize)} · {ext.toUpperCase()}
                            </p>
                        </div>

                        {/* Video preview — container sized to exact native aspect ratio
                so there is no letterbox bar above/below the video */}
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                aspectRatio: videoAspect,
                                background: "#000",
                                borderRadius: "var(--radius-lg)",
                                overflow: "hidden",
                                border: "1px solid var(--border-default)",
                            }}
                        >
                            <video
                                ref={previewVideoRef}
                                src={compositeBlobUrl ?? blobUrl}
                                controls
                                onLoadedMetadata={handlePreviewMetadata}
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                    display: "block",
                                }}
                            />
                        </div>

                        {/* Filename */}
                        <Input
                            label="File Name"
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            placeholder={defaultFilename()}
                            trailingText={`.${ext}`}
                            helperText="Rename before downloading"
                        />

                        <div className="flex flex-wrap gap-2">
                            {compositeBlobUrl ? (
                                <Button variant="primary" emoji="⬇️" onClick={downloadComposed}>
                                    Download Composed Video
                                </Button>
                            ) : null}
                            <Button
                                variant={compositeBlobUrl ? "secondary" : "primary"}
                                emoji="⬇️"
                                onClick={downloadRecording}
                            >
                                Download Screen Recording
                            </Button>
                            {/* TODO: when webcam re-enabled, add Download Webcam + Compose buttons here */}
                            <Button variant="ghost" emoji="🔄" onClick={reset}>
                                Record Again
                            </Button>
                        </div>
                    </div>
                </Panel>
            )}

            {/* ── Keyframes ─────────────────────────────────────────────────────── */}
            <style>{`
        @keyframes rec-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.15; }
        }
        @keyframes countdown-pop {
          0%   { transform: scale(1.5); opacity: 0; }
          25%  { transform: scale(1);   opacity: 1; }
          75%  { transform: scale(1);   opacity: 1; }
          100% { transform: scale(0.7); opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>
        </div>
    );
}