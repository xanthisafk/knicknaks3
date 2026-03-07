import { useState } from "react";

export default function InfoToolTip({ text, url }: { url?: string; text: string }) {
    const [show, setShow] = useState(false);
    return (
        <span className="relative inline-flex items-center ml-1">
            <button
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                onFocus={() => setShow(true)}
                onBlur={() => setShow(false)}
                onClick={() => {
                    if (url) window.open(url, "_blank");
                }}
                className="w-4 h-4 rounded-full cursor-pointer flex items-center justify-center shrink-0 text-[9px] font-bold leading-none transition-opacity opacity-50 hover:opacity-100 bg-(--text-tertiary) text-(--surface-primary)"
                aria-label="Source info"
            >
                i
            </button>
            {show && (
                <div
                    className="absolute z-50 rounded-xl shadow-lg text-xs p-3 w-60 pointer-events-none"
                    style={{
                        bottom: "calc(100% + 8px)",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "var(--surface-elevated)",
                        color: "var(--text-secondary)",
                        border: "1px solid var(--border-default)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    }}
                >
                    <p className="leading-relaxed">{text}</p>
                    {url && (
                        <span
                            className="inline-flex items-center gap-1 mt-2 text-primary-500 hover:underline pointer-events-auto"
                        >
                            Click to Open Source
                        </span>
                    )}
                    {/* Arrow */}
                    <span
                        className="absolute left-1/2 -translate-x-1/2 -bottom-[5px] w-2.5 h-2.5 rotate-45"
                        style={{
                            background: "var(--surface-elevated)",
                            borderRight: "1px solid var(--border-default)",
                            borderBottom: "1px solid var(--border-default)",
                        }}
                    />
                </div>
            )}
        </span>
    );
}