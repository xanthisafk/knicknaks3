import type { MatchResult } from "@/lib/regexHelper";

export function HighlightMatches(text: string, matches: MatchResult[]): React.ReactNode[] {
    if (!matches.length) return [text];

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    for (let i = 0; i < matches.length; i++) {
        const m = matches[i];
        if (m.index > lastIndex) {
            parts.push(text.slice(lastIndex, m.index));
        }
        parts.push(
            <mark
                key={i}
                className="bg-(--surface-elevated) text-accent-500 rounded-sm px-0.5"
                title={`Match ${i + 1}`}
            >
                {m.full}
            </mark>
        );
        lastIndex = m.index + m.full.length;
    }

    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts;
}