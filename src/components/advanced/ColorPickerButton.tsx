import { useRef } from "react";

export function ColorPickerButton({
    title,
    value,
    onChange,
    icon,
    underlineColor,
}: {
    title: string;
    value: string;
    onChange: (color: string) => void;
    icon: string;
    underlineColor?: string;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <button
            type="button"
            title={title}
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center rounded transition-all duration-150 select-none relative"
            style={{
                width: 30,
                height: 30,
                cursor: "pointer",
                background: "transparent",
                border: "1px solid transparent",
                color: "var(--text-secondary)",
                fontSize: 13,
                fontWeight: 700,
            }}
            onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.background =
                "var(--surface-secondary)")
            }
            onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.background = "transparent")
            }
        >
            <span style={{ lineHeight: 1 }}>{icon}</span>
            <span
                style={{
                    position: "absolute",
                    bottom: 3,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 16,
                    height: 3,
                    borderRadius: 2,
                    background: underlineColor ?? value,
                }}
            />
            <input
                ref={inputRef}
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    position: "absolute",
                    opacity: 0,
                    width: 0,
                    height: 0,
                    pointerEvents: "none",
                }}
                tabIndex={-1}
            />
        </button>
    );
}