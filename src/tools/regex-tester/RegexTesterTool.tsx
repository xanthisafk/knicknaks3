import { useState, useMemo } from "react";
import { Input, Textarea, Toggle } from "@/components/ui";
import { Panel } from "@/components/layout";

interface MatchResult {
  full: string;
  index: number;
  groups: string[];
}

function findMatches(pattern: string, flags: string, text: string): { matches: MatchResult[]; error: string } {
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

function highlightMatches(text: string, matches: MatchResult[]): React.ReactNode[] {
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
        className="bg-[var(--color-primary-200)] dark:bg-[var(--color-primary-700)] text-[var(--text-primary)] rounded-sm px-0.5"
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

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
  const [text, setText] = useState("");

  const flagString = Object.entries(flags)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join("");

  const { matches, error } = useMemo(
    () => findMatches(pattern, flagString, text),
    [pattern, flagString, text]
  );

  const highlighted = useMemo(
    () => highlightMatches(text, matches),
    [text, matches]
  );

  return (
    <div className="space-y-6">
      {/* Pattern input */}
      <Panel>
        <div className="space-y-3">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                label="Pattern"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="[a-z]+"
                className="font-[family-name:var(--font-mono)]"
                error={error}
              />
            </div>
            <div className="flex items-center gap-3 pb-1">
              {(["g", "i", "m", "s"] as const).map((flag) => (
                <label key={flag} className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={flags[flag]}
                    onChange={(e) => setFlags({ ...flags, [flag]: e.target.checked })}
                    className="w-4 h-4 rounded accent-[var(--color-primary-500)]"
                  />
                  <span className="text-sm font-[family-name:var(--font-mono)] text-[var(--text-primary)]">{flag}</span>
                </label>
              ))}
            </div>
          </div>
          <p className="text-xs text-[var(--text-tertiary)]">
            /{pattern || "..."}/{flagString}
          </p>
        </div>
      </Panel>

      {/* Test string */}
      <Panel>
        <div className="space-y-3">
          <label className="text-sm font-medium text-[var(--text-primary)]">Test String</label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to test against your pattern..."
            className="h-32 text-sm"
          />
        </div>
      </Panel>

      {/* Highlighted output */}
      {text && pattern && !error && (
        <Panel>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--text-primary)]">Highlighted Matches</label>
              <span className="text-xs text-[var(--text-tertiary)]">
                {matches.length} match{matches.length !== 1 ? "es" : ""}
              </span>
            </div>
            <div className="px-3 py-3 rounded-[var(--radius-md)] bg-[var(--surface-secondary)] font-[family-name:var(--font-mono)] text-sm text-[var(--text-primary)] whitespace-pre-wrap break-all">
              {highlighted}
            </div>
          </div>
        </Panel>
      )}

      {/* Match details */}
      {matches.length > 0 && (
        <Panel>
          <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">
            Match Details ({matches.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {matches.map((m, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--surface-secondary)] text-sm"
              >
                <span className="text-xs text-[var(--text-tertiary)] font-[family-name:var(--font-mono)] min-w-[30px]">
                  #{i + 1}
                </span>
                <div className="flex-1">
                  <code className="text-[var(--color-primary-600)] font-[family-name:var(--font-mono)]">
                    "{m.full}"
                  </code>
                  <span className="text-xs text-[var(--text-tertiary)] ml-2">@ index {m.index}</span>
                  {m.groups.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {m.groups.map((g, gi) => (
                        <span
                          key={gi}
                          className="text-xs px-1.5 py-0.5 rounded bg-[var(--color-accent-100)] dark:bg-[var(--color-accent-700)] text-[var(--text-primary)]"
                        >
                          ${gi + 1}: "{g}"
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
