export function SectionHeader({ icon, title, count, open, onToggle }: {
    icon: string; title: string; count: number; open: boolean; onToggle: () => void;
}) {
    return (
        <button
            onClick={onToggle}
            className="w-full flex items-center gap-3 px-5 py-3.5 text-left cursor-pointer"
        >
            <span className="font-emoji">{icon}</span>
            <span className="text-sm font-semibold text-(--text-primary) flex-1">{title}</span>
            <span className="text-[11px] text-(--text-tertiary) mr-1">{count} field{count !== 1 ? "s" : ""}</span>
            <span className="text-(--text-tertiary) text-xs">{open ? "▴" : "▾"}</span>
        </button>
    );
}