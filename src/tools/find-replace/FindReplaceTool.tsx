import { useState, useMemo, useCallback } from "react";
import { Input, Textarea, Button, Toggle } from "@/components/ui";
import { Panel } from "@/components/layout";

interface MatchInfo {
  index: number;
  length: number;
  text: string;
}

function findMatches(
  source: string,
  find: string,
  caseSensitive: boolean,
  useRegex: boolean,
  globalReplace: boolean
): { matches: MatchInfo[]; error: string } {
  if (!find || !source) return { matches: [], error: "" };

  try {
    const flags = (globalReplace ? "g" : "") + (caseSensitive ? "" : "i");

    if (useRegex) {
      const regex = new RegExp(find, flags);
      const matches: MatchInfo[] = [];
      let m: RegExpExecArray | null;
      let safety = 0;

      if (globalReplace) {
        while ((m = regex.exec(source)) !== null && safety < 5000) {
          matches.push({ index: m.index, length: m[0].length, text: m[0] });
          if (m[0].length === 0) regex.lastIndex++;
          safety++;
        }
      } else {
        m = regex.exec(source);
        if (m) {
          matches.push({ index: m.index, length: m[0].length, text: m[0] });
        }
      }
      return { matches, error: "" };
    } else {
      // Plain text search
      const matches: MatchInfo[] = [];
      const searchIn = caseSensitive ? source : source.toLowerCase();
      const searchFor = caseSensitive ? find : find.toLowerCase();
      let pos = 0;

      while (pos < searchIn.length) {
        const idx = searchIn.indexOf(searchFor, pos);
        if (idx === -1) break;
        matches.push({ index: idx, length: find.length, text: source.slice(idx, idx + find.length) });
        pos = idx + Math.max(1, find.length);
        if (!globalReplace) break;
      }
      return { matches, error: "" };
    }
  } catch (e) {
    return { matches: [], error: e instanceof Error ? e.message : "Invalid pattern" };
  }
}

function doReplace(
  source: string,
  find: string,
  replace: string,
  caseSensitive: boolean,
  useRegex: boolean,
  globalReplace: boolean
): { result: string; error: string } {
  if (!find || !source) return { result: source, error: "" };

  try {
    const flags = (globalReplace ? "g" : "") + (caseSensitive ? "" : "i");

    if (useRegex) {
      const regex = new RegExp(find, flags);
      return { result: source.replace(regex, replace), error: "" };
    } else {
      if (globalReplace) {
        // Plain text global replace
        const searchIn = caseSensitive ? source : source.toLowerCase();
        const searchFor = caseSensitive ? find : find.toLowerCase();
        let result = "";
        let pos = 0;

        while (pos < searchIn.length) {
          const idx = searchIn.indexOf(searchFor, pos);
          if (idx === -1) {
            result += source.slice(pos);
            break;
          }
          result += source.slice(pos, idx) + replace;
          pos = idx + find.length;
        }
        return { result, error: "" };
      } else {
        const flags2 = caseSensitive ? "" : "i";
        const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escaped, flags2);
        return { result: source.replace(regex, replace), error: "" };
      }
    }
  } catch (e) {
    return { result: source, error: e instanceof Error ? e.message : "Replace failed" };
  }
}

function highlightMatches(source: string, matches: MatchInfo[]): React.ReactNode[] {
  if (!matches.length) return [source];

  const parts: React.ReactNode[] = [];
  let lastEnd = 0;

  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    if (m.index > lastEnd) {
      parts.push(source.slice(lastEnd, m.index));
    }
    parts.push(
      <mark
        key={i}
        className="bg-(--surface-elevated) font-bold text-accent-500 rounded-sm p-0.5"
      >
        {m.text}
      </mark>
    );
    lastEnd = m.index + m.length;
  }

  if (lastEnd < source.length) {
    parts.push(source.slice(lastEnd));
  }

  return parts;
}

export default function FindReplaceTool() {
  const [source, setSource] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [globalReplace, setGlobalReplace] = useState(true);
  const [copied, setCopied] = useState(false);

  const { matches, error } = useMemo(
    () => findMatches(source, find, caseSensitive, useRegex, globalReplace),
    [source, find, caseSensitive, useRegex, globalReplace]
  );

  const highlighted = useMemo(
    () => highlightMatches(source, matches),
    [source, matches]
  );

  const { result: replacedText } = useMemo(
    () => doReplace(source, find, replace, caseSensitive, useRegex, globalReplace),
    [source, find, replace, caseSensitive, useRegex, globalReplace]
  );

  const handleApply = useCallback(() => {
    setSource(replacedText);
    setFind("");
    setReplace("");
  }, [replacedText]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(replacedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [replacedText]);

  return (
    <div className="space-y-2">
      {/* Source Text */}
      <Panel>
        <div className="space-y-2">
          <Textarea
            value={source}
            label="Source Text"
            onChange={(e) => setSource(e.target.value)}
            placeholder="Paste or type your text here..."
            className="h-36 text-sm"
          />
          <p className="text-xs text-(--text-tertiary) text-right">
            {source.length} character{source.length !== 1 ? "s" : ""}
          </p>
        </div>
      </Panel>

      {/* Find & Replace Inputs */}
      <Panel>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Find"
              value={find}
              onChange={(e) => setFind(e.target.value)}
              placeholder={useRegex ? "[a-z]+" : "Search term..."}
              error={error}
            />
            <Input
              label="Replace with"
              value={replace}
              onChange={(e) => setReplace(e.target.value)}
              placeholder={useRegex ? "Use $1, $2 for groups" : "Replacement text..."}
            />
          </div>

          {/* Options */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Toggle
              label="Case Sensitive"
              checked={caseSensitive}
              onChange={setCaseSensitive}
            />
            <Toggle
              label="Regex"
              checked={useRegex}
              onChange={setUseRegex}
            />
            <Toggle
              label="Global"
              checked={globalReplace}
              onChange={setGlobalReplace}
            />

            {matches.length > 0 && (
              <span className="ml-auto text-xs text-(--text-tertiary) font-medium">
                {matches.length} match{matches.length !== 1 ? "es" : ""}
              </span>
            )}
          </div>
        </div>
      </Panel>

      {/* Highlighted Preview */}
      {source && find && !error && matches.length > 0 && (
        <Panel>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label
                className="block text-xs font-medium uppercase tracking-wide text-(--text-tertiary) mb-1.5"
              >
                Highlighted Matches
              </label>
              <span className="text-xs text-(--text-tertiary)">
                {matches.length} match{matches.length !== 1 ? "es" : ""}
              </span>
            </div>
            <div className="px-3 py-3 rounded-md bg-(--surface-secondary) border border-(--border-default) text-sm text-(--text-primary) whitespace-pre-wrap break-all font-mono max-h-48 overflow-y-auto">
              {highlighted}
            </div>
          </div>
        </Panel>
      )}

      {/* Result Preview */}
      {source && find && replace !== undefined && matches.length > 0 && (
        <Panel>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label
                className="block text-xs font-medium uppercase tracking-wide text-(--text-tertiary) mb-1.5"
              >
                Result Preview
              </label>
            </div>
            <div className="px-3 py-3 rounded-md bg-(--surface-secondary) border border-(--border-default) text-sm text-(--text-primary) whitespace-pre-wrap break-all font-mono max-h-48 overflow-y-auto select-all">
              {replacedText}
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleApply}>
                Apply to Source
              </Button>
              <Button onClick={handleCopy} variant={copied ? "primary" : "secondary"}>
                {copied ? "✓ Copied!" : "Copy Result"}
              </Button>
            </div>
          </div>
        </Panel>
      )}

      {/* Empty state */}
      {!source && (
        <Panel>
          <div className="text-center py-8 text-(--text-tertiary)">
            <p className="text-4xl mb-3 font-emoji">🔎</p>
            <p className="text-sm">Paste your text above, then enter a search term to find and replace</p>
          </div>
        </Panel>
      )}
    </div>
  );
}
