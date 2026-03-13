import { useState, useMemo } from "react";
import { Textarea, Button } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

type DiffOp = { type: "equal" | "insert" | "delete"; value: string };

function computeDiff(a: string, b: string): DiffOp[] {
  const aLines = a.split("\n");
  const bLines = b.split("\n");
  const n = aLines.length;
  const m = bLines.length;
  // Simple LCS-based diff
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i][j] = aLines[i] === bLines[j]
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1]);

  const ops: DiffOp[] = [];
  let i = 0, j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && aLines[i] === bLines[j]) {
      ops.push({ type: "equal", value: aLines[i] });
      i++; j++;
    } else if (j < m && (i >= n || dp[i][j + 1] >= dp[i + 1][j])) {
      ops.push({ type: "insert", value: bLines[j] });
      j++;
    } else {
      ops.push({ type: "delete", value: aLines[i] });
      i++;
    }
  }
  return ops;
}

export default function TextDiffTool() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [copied, setCopied] = useState(false);

  const diff = useMemo(() => (left || right) ? computeDiff(left, right) : null, [left, right]);

  const stats = useMemo(() => {
    if (!diff) return null;
    const added = diff.filter(d => d.type === "insert").length;
    const removed = diff.filter(d => d.type === "delete").length;
    const unchanged = diff.filter(d => d.type === "equal").length;
    return { added, removed, unchanged };
  }, [diff]);

  const handleCopy = async () => {
    if (!diff) return;
    const text = diff.map(d =>
      d.type === "insert" ? `+ ${d.value}` :
        d.type === "delete" ? `- ${d.value}` :
          `  ${d.value}`
    ).join("\n");
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Panel>
          <div className="space-y-2">
            <label className="text-sm font-medium text(--text-primary)">Original</label>
            <Textarea
              value={left}
              onChange={e => setLeft(e.target.value)}
              placeholder="Paste original text here..."
              className="h-40 text-sm font-[family-name:var(--font-mono)]"
            />
          </div>
        </Panel>
        <Panel>
          <div className="space-y-2">
            <label className="text-sm font-medium text(--text-primary)">Modified</label>
            <Textarea
              value={right}
              onChange={e => setRight(e.target.value)}
              placeholder="Paste modified text here..."
              className="h-40 text-sm font-[family-name:var(--font-mono)]"
            />
          </div>
        </Panel>
      </div>

      {stats && (
        <div className="flex flex-wrap gap-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--surface-secondary)] text(--text-secondary)">
            {stats.unchanged} unchanged
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/15 text-green-500">
            +{stats.added} added
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/15 text-red-500">
            -{stats.removed} removed
          </span>
          <Button size="sm" variant="secondary" onClick={handleCopy} className="ml-auto">
            {copied ? "✓ Copied" : "Copy Diff"}
          </Button>
        </div>
      )}

      {diff && diff.length > 0 && (
        <Panel>
          <div className="space-y-0.5 font-[family-name:var(--font-mono)] text-sm max-h-96 overflow-y-auto">
            {diff.map((op, i) => (
              <div
                key={i}
                className={`px-3 py-0.5 rounded-sm whitespace-pre-wrap break-all ${op.type === "insert"
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : op.type === "delete"
                      ? "bg-red-500/10 text-red-600 dark:text-red-400 line-through opacity-70"
                      : "text(--text-secondary)"
                  }`}
              >
                <span className="select-none mr-2 opacity-50">
                  {op.type === "insert" ? "+" : op.type === "delete" ? "−" : " "}
                </span>
                {op.value || "\u00a0"}
              </div>
            ))}
          </div>
        </Panel>
      )}

      {!diff && (
        <p className="text-center text-sm text-[var(--text-tertiary)]">
          Paste text in both panels to see the diff
        </p>
      )}
    </div>
  );
}
