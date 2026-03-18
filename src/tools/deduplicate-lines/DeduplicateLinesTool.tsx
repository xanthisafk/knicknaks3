import { useState, useMemo } from "react";
import { Button, Textarea, Toggle } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

function dedup(text: string, ignoreCase: boolean, trimWhitespace: boolean): { result: string; removed: number } {
  const lines = text.split("\n");
  const seen = new Set<string>();
  const unique: string[] = [];
  let removed = 0;

  for (const line of lines) {
    let key = trimWhitespace ? line.trim() : line;
    if (ignoreCase) key = key.toLowerCase();
    if (seen.has(key)) {
      removed++;
    } else {
      seen.add(key);
      unique.push(line);
    }
  }

  return { result: unique.join("\n"), removed };
}

export default function DeduplicateLinesTool() {
  const [input, setInput] = useState("");
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [copied, setCopied] = useState(false);

  const { result, removed } = useMemo(
    () => dedup(input, ignoreCase, trimWhitespace),
    [input, ignoreCase, trimWhitespace]
  );

  const handleCopy = async () => {
    if (await copyToClipboard(result)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const totalLines = input ? input.split("\n").length : 0;

  return (
    <div className="space-y-2">
      <Panel className="space-y-2">
        <Textarea
          value={input}
          label="Input"
          onChange={(e) => setInput(e.target.value)}
          placeholder={"apple\nbanana\napple\ncherry\nbanana"}
        />
        <div className="flex flex-wrap items-center gap-4">
          <Toggle label="Ignore case" checked={ignoreCase} onChange={setIgnoreCase} />
          <Toggle label="Trim whitespace" checked={trimWhitespace} onChange={setTrimWhitespace} />
          {removed > 0 && (
            <span className="text-sm text-primary-600 font-medium ml-auto">
              <span className="font-emoji">🧹</span> {removed} duplicate{removed > 1 ? "s" : ""} removed ({totalLines} → {totalLines - removed} lines)
            </span>
          )}
        </div>
      </Panel>
      <Panel>
        <Textarea value={result} readOnly label="Output" />
      </Panel>


    </div>
  );
}
