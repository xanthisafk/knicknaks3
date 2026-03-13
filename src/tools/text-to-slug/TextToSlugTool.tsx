import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

function toSlug(text: string, separator: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .replace(/\s+/g, separator) // Replace spaces
    .replace(new RegExp(`[${separator}]+`, "g"), separator) // Collapse separators
    .replace(new RegExp(`^${separator}|${separator}$`, "g"), ""); // Trim separators
}

export default function TextToSlugTool() {
  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState("-");
  const [copied, setCopied] = useState(false);

  const slug = toSlug(input, separator);

  const handleCopy = async () => {
    if (await copyToClipboard(slug)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-2">
      <Panel>
        <div className="space-y-4">
          <Input
            label="Input Text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="My Blog Post Title! (2024)"
          />

          <div className="flex items-center gap-3">
            <span className="text-sm text(--text-secondary)">Separator:</span>
            {["-", "_", "."].map((sep) => (
              <button
                key={sep}
                onClick={() => setSeparator(sep)}
                className={`px-3 py-1 text-sm font-[family-name:var(--font-mono)] rounded-[var(--radius-md)] transition-colors cursor-pointer ${separator === sep
                    ? "bg-[var(--color-primary-500)] text-white"
                    : "bg-[var(--surface-secondary)] text(--text-secondary)"
                  }`}
              >
                {sep === "-" ? "hyphen" : sep === "_" ? "underscore" : "dot"}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      {slug && (
        <Panel>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text(--text-primary)">Generated Slug</label>
              <Button size="sm" variant="ghost" onClick={handleCopy}>
                {copied ? "✓ Copied!" : "📋 Copy"}
              </Button>
            </div>
            <div
              className="px-4 py-3 rounded-[var(--radius-md)] bg-[var(--surface-secondary)] font-[family-name:var(--font-mono)] text-base text-[var(--color-primary-500)] border border-[var(--border-default)] select-all cursor-pointer"
              onClick={handleCopy}
            >
              {slug}
            </div>
            <p className="text-xs text-[var(--text-tertiary)]">
              Preview: example.com/blog/<strong>{slug}</strong>
            </p>
          </div>
        </Panel>
      )}
    </div>
  );
}
