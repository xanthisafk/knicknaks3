import { useState, useMemo } from "react";
import { Input, Textarea, Toggle } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Checkbox } from "@/components/ui/Checkbox";
import { ToggleGroup } from "@/components/ui/ToggleGroup";
import { findMatches } from "@/lib/regexHelper";
import { HighlightMatches } from "./HighlightMatches";


export default function RegexTesterTool() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState<string[]>([]);
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
    () => HighlightMatches(text, matches),
    [text, matches]
  );

  return (
    <div className="space-y-2">
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
                error={error}
              />
            </div>
            <ToggleGroup
              label="Flags"
              options={[
                { value: "g", title: "global" },
                { value: "i", title: "case insensitive" },
                { value: "m", title: "multiline" },
                { value: "s", title: "dotAll" },
              ]}
              value={flags}
              onChange={setFlags}
            />
          </div>
          <p className="text-xs text-(--text-tertiary)">
            Parsed: /{pattern || "..."}/{flagString}
          </p>
        </div>
      </Panel>

      {/* Test string */}
      <Panel>
        <div className="space-y-3">
          <Textarea
            value={text}
            label="Test String"
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to test against your pattern..."
            className="h-32 text-sm transition-none"
          />
        </div>
      </Panel>

      {/* Highlighted output */}
      {text && pattern && !error && (
        <Panel>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text(--text-primary)">Highlighted Matches</label>
              <span className="text-xs text-(--text-tertiary)">
                {matches.length} match{matches.length !== 1 ? "es" : ""}
              </span>
            </div>
            <div className="px-3 py-3 rounded-md bg-(--surface-secondary) font-mono text-sm text(--text-primary) whitespace-pre-wrap break-all">
              {highlighted}
            </div>
          </div>
        </Panel>
      )}

      {/* Match details */}
      {matches.length > 0 && (
        <Panel>
          <div className="space-y-3">
            <label className="text-sm font-medium text(--text-primary)">Match Details ({matches.length})</label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {matches.map((m, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 px-3 py-2 rounded-md bg-(--surface-secondary) text-sm"
                >
                  <span className="text-xs text-(--text-tertiary) font-mono min-w-[30px]">
                    #{i + 1}
                  </span>
                  <div className="flex-1">
                    <code className="text-primary-600 font-mono">
                      "{m.full}"
                    </code>
                    <span className="text-xs text-(--text-tertiary) ml-2">@ index {m.index}</span>
                    {m.groups.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {m.groups.map((g, gi) => (
                          <mark
                            key={gi}
                            className="text-xs bg-(--surface-elevated) text-accent-500 px-1.5 py-0.5 rounded"
                          >
                            ${gi + 1}: "{g}"
                          </mark>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}
