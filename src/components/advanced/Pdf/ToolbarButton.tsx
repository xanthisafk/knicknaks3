export function ToolbarButton({
    active,
    onClick,
    title,
    children,
    disabled,
}: {
    active?: boolean;
    onClick: () => void;
    title: string;
    children: React.ReactNode;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            title={title}
            disabled={disabled}
            onClick={onClick}
            className="flex items-center justify-center rounded transition-all duration-150 select-none"
            style={{
                width: 30,
                height: 30,
                fontSize: 13,
                fontWeight: 600,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.4 : 1,
                background: active ? "var(--color-primary-100)" : "transparent",
                color: active ? "var(--color-primary-700)" : "var(--text-secondary)",
                border: active
                    ? "1px solid var(--color-primary-300)"
                    : "1px solid transparent",
            }}
            onMouseEnter={(e) => {
                if (!active && !disabled)
                    (e.currentTarget as HTMLButtonElement).style.background =
                        "var(--surface-secondary)";
            }}
            onMouseLeave={(e) => {
                if (!active)
                    (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
            }}
        >
            {children}
        </button>
    );
}