import type { IntegrityResult } from "@/lib/imageHelper";

export function IntegrityBadge({ result }: { result: IntegrityResult }) {
    if (result.ok && result.notes.length === 0) {
        return (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 border border-green-500/20">
                ✓ File OK
            </span>
        );
    }
    if (result.issues.length > 0) {
        return (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                ⚠ Integrity issue
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
            ℹ Note
        </span>
    );
}