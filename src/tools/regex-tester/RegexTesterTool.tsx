import { useState, useMemo } from "react";
import { Input, Label, Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Container } from "@/components/layout/Primitive";
import { ToggleGroup } from "@/components/ui/ToggleGroup";
import { findMatches } from "@/lib/regexHelper";
import { HighlightMatches } from "./HighlightMatches";

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState<string[]>(["g", "m"]);
  const [text, setText] = useState("");

  const flagString = flags.join("");

  const { matches, error } = useMemo(
    () => findMatches(pattern, flagString, text),
    [pattern, flagString, text]
  );

  const matchesKey = useMemo(
    () => matches.map((m) => `${m.index}:${m.full}`).join("|"),
    [matches]
  );

  const highlighted = useMemo(
    () => <HighlightMatches text={text} matches={matches} />,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [text, matchesKey] // use matchesKey instead of matches to avoid reference churn
  );

  return (
    <Container>
      <Panel className="space-y-2">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              label="Pattern"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="[a-z]+"
              handlePaste={(v) => setPattern(v)}
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
        {error && <Label variant="danger">{error}</Label>}
        <p className="text-xs text-(--text-tertiary)">
          <Label>Parsed:</Label> /{pattern || "..."}/{flagString}
        </p>
      </Panel>

      {/* Test string */}
      <Panel>
        <div className="space-y-3">
          <Textarea
            value={text}
            label="Test String"
            onChange={(e) => setText(e.target.value)}
            handlePaste={(v) => setText(v)}
            placeholder="Enter text to test against your pattern..."
          />
        </div>
      </Panel>

      {/* Highlighted output */}
      {text && pattern && !error && (
        <Panel>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Highlighted Matches</Label>
              <Label>{matches.length} match{matches.length !== 1 ? "es" : ""}</Label>
            </div>
            <div className="px-3 py-3 rounded-md bg-(--surface-secondary) font-mono text-sm text-(--text-primary) whitespace-pre-wrap break-all">
              {highlighted}
            </div>
          </div>
        </Panel>
      )}

      {/* Match details */}
      {matches.length > 0 && (
        <Panel>
          <div className="space-y-3">
            <label className="text-sm font-medium text-(--text-primary)">
              Match Details ({matches.length})
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {matches.map((m, i) => (
                <div
                  key={`${m.index}-${m.full}`}
                  className="flex items-start gap-3 px-3 py-2 rounded-md bg-(--surface-secondary) text-sm"
                >
                  <span className="text-xs text-(--text-tertiary) font-mono min-w-[30px]">
                    #{i + 1}
                  </span>
                  <div className="flex-1">
                    <code className="text-primary-600 font-mono">
                      &quot;{m.full}&quot;
                    </code>
                    <span className="text-xs text-(--text-tertiary) ml-2">
                      @ index {m.index}
                    </span>
                    {m.groups.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {m.groups.map((g, gi) => (
                          <mark
                            key={gi}
                            className="text-xs bg-(--surface-elevated) text-accent-500 px-1.5 py-0.5 rounded"
                          >
                            ${gi + 1}: &quot;{g}&quot;
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
    </Container>
  );
}