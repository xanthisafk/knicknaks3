export const WAVEFORM_BARS = 128;

// Decorative sine-based placeholder bars
export const PLACEHOLDER_BARS = Array.from({ length: WAVEFORM_BARS }, (_, i) =>
    Math.abs(Math.sin(i * 0.7 + 1) * 0.35 + Math.sin(i * 1.9) * 0.2) + 0.07
);

export interface WaveformProps {
    peaks: number[];
    progress: number;
    isReal: boolean;
    onScrub: (ratio: number) => void;
}

export function Waveform({ peaks, progress, isReal, onScrub }: WaveformProps) {
    const bars = peaks.length ? peaks : PLACEHOLDER_BARS;

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        onScrub(ratio);
    };

    return (
        <div
            role="slider"
            aria-label="Audio seek"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            tabIndex={0}
            className="relative flex items-center gap-px h-16 rounded-lg overflow-hidden cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-(--border-focus)"
            onClick={handleClick}
            onKeyDown={(e) => {
                if (e.key === "ArrowRight") onScrub(Math.min(1, progress + 0.02));
                if (e.key === "ArrowLeft") onScrub(Math.max(0, progress - 0.02));
            }}
        >
            {bars.map((h, i) => {
                const barProgress = i / WAVEFORM_BARS;
                const played = isReal && barProgress < progress;
                const isHead = isReal && Math.abs(barProgress - progress) < 1 / WAVEFORM_BARS;
                return (
                    <div
                        key={i}
                        className="flex-1 rounded-full"
                        style={{
                            height: `${Math.round(h * 100)}%`,
                            background: isHead
                                ? "var(--color-primary-400)"
                                : played
                                    ? "var(--color-primary-500)"
                                    : isReal
                                        ? "color-mix(in srgb, var(--color-primary-500) 28%, var(--surface-secondary))"
                                        : "var(--border-default)",
                            opacity: isReal ? 1 : 0.45,
                            transition: "background 80ms linear",
                        }}
                    />
                );
            })}

            {isReal && (
                <div
                    className="absolute inset-y-0 w-px bg-primary-400 opacity-70 pointer-events-none"
                    style={{ left: `${progress * 100}%` }}
                />
            )}
        </div>
    );
}