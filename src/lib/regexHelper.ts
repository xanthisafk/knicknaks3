export interface MatchResult {
    full: string;
    index: number;
    groups: string[];
}

export function findMatches(pattern: string, flags: string, text: string): { matches: MatchResult[]; error: string } {
    if (!pattern) return { matches: [], error: "" };
    try {
        const regex = new RegExp(pattern, flags);
        const matches: MatchResult[] = [];

        if (flags.includes("g")) {
            let match: RegExpExecArray | null;
            let safety = 0;
            while ((match = regex.exec(text)) !== null && safety < 1000) {
                matches.push({
                    full: match[0],
                    index: match.index,
                    groups: match.slice(1),
                });
                if (match[0].length === 0) regex.lastIndex++;
                safety++;
            }
        } else {
            const match = regex.exec(text);
            if (match) {
                matches.push({
                    full: match[0],
                    index: match.index,
                    groups: match.slice(1),
                });
            }
        }

        return { matches, error: "" };
    } catch (e) {
        return { matches: [], error: e instanceof Error ? e.message : "Invalid regex" };
    }
}

