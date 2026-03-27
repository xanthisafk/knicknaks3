import { Tooltip, WaitForContent } from "@/components/ui";
import { Download, Pause, Play, Volume2 } from "lucide-react";
import { Waveform, WAVEFORM_BARS } from "./Waveform";
import { formatTime } from "./lib";
import { useEffect, useRef, useState } from "react";
import { decodeWaveformPeaks } from "@/lib/audioHelper";

export interface AudioPlayerProps {
    src: string | null;
    loading: boolean;
}

export function AudioPlayer({ src, loading }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const prevSrcRef = useRef<string | null>(null);

    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [peaks, setPeaks] = useState<number[]>([]);

    // Decode waveform whenever src changes
    useEffect(() => {
        if (!src) { setPeaks([]); return; }
        let cancelled = false;
        decodeWaveformPeaks(src, WAVEFORM_BARS)
            .then(p => { if (!cancelled) setPeaks(p); })
            .catch(() => { });
        return () => { cancelled = true; };
    }, [src]);

    // Reset player state on new src
    useEffect(() => {
        if (src && audioRef.current) {
            audioRef.current.load();
            setCurrentTime(0);
            setPlaying(false);
        }
    }, [src]);

    const progress = duration > 0 ? currentTime / duration : 0;
    const isReal = peaks.length > 0;

    const handleScrub = (ratio: number) => {
        if (!audioRef.current || !duration) return;
        const t = ratio * duration;
        audioRef.current.currentTime = t;
        setCurrentTime(t);
    };

    const togglePlay = () => {
        if (!audioRef.current || !src) return;
        playing ? audioRef.current.pause() : audioRef.current.play();
    };

    return (
        <div
            className="rounded-xl border border-(--border-default) bg-(--surface-secondary) p-4 space-y-3"
            style={{ opacity: !src && !loading ? 0.5 : 1, }}
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

            {/* Status bar */}
            <div className="flex items-center justify-between h-5">
                {loading ? (
                    <WaitForContent text="Generating audio..." />
                ) : src ? (
                    <span className="text-xs text-(--text-tertiary) uppercase tracking-widest font-medium">
                        {isReal ? "" : "Decoding…"}
                    </span>
                ) : (
                    <span className="text-xs text-(--text-tertiary)">No audio yet</span>
                )}
                <span className="text-xs font-mono tabular-nums text-(--text-tertiary)">
                    {formatTime(currentTime)}&thinsp;/&thinsp;{formatTime(duration)}
                </span>
            </div>

            {/* Waveform */}
            <Waveform peaks={peaks} progress={progress} isReal={isReal} onScrub={handleScrub} />

            {/* Controls */}
            <div className="flex items-center gap-3">
                {/* Play / Pause */}
                <button
                    type="button"
                    onClick={togglePlay}
                    disabled={!src}
                    aria-label={playing ? "Pause" : "Play"}
                    className="w-9 h-9 rounded-full bg-primary-500 text-white flex items-center justify-center disabled:opacity-40 hover:bg-primary-600 active:scale-95 shadow-sm shrink-0"
                >
                    {playing ? <Pause /> : <Play />}
                </button>

                {/* Seek */}
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
                    aria-label="Seek"
                    className="flex-1 h-1 accent-primary-500 cursor-pointer disabled:cursor-not-allowed rounded-full"
                />

                {/* Volume */}
                <div className="flex items-center gap-1.5 shrink-0">
                    <Volume2 className="opacity-40 shrink-0" />
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
                        aria-label="Volume"
                        className="w-16 h-1 accent-primary-500 cursor-pointer"
                    />
                </div>

                {/* Download */}
                {src && (
                    <Tooltip content="Download WAV" position="top">
                        <a
                            href={src}
                            download="kokoro-speech.wav"
                            className="p-1.5 rounded-lg hover:bg-(--surface-elevated) text-(--text-tertiary) hover:text-(--text-primary)"
                        >
                            <Download />
                        </a>
                    </Tooltip>
                )}
            </div>
        </div>
    );
}