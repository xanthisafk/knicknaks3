import { useState, useCallback } from "react";
import { Button, Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

const ALGORITHMS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
type Algorithm = (typeof ALGORITHMS)[number];

async function computeHash(text: string, algorithm: Algorithm): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function computeFileHash(file: File, algorithm: Algorithm): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function HashRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (await copyToClipboard(value)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>
        {value && (
          <button
            onClick={handleCopy}
            className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        )}
      </div>
      <div className="px-3 py-2 rounded-[var(--radius-md)] bg-[var(--surface-secondary)] font-[family-name:var(--font-mono)] text-xs break-all text-[var(--text-primary)] min-h-[36px]">
        {value || <span className="text-[var(--text-tertiary)]">—</span>}
      </div>
    </div>
  );
}

export default function HashGeneratorTool() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<Algorithm, string>>({
    "SHA-1": "",
    "SHA-256": "",
    "SHA-384": "",
    "SHA-512": "",
  });
  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const hashText = useCallback(async (text: string) => {
    if (!text.trim()) {
      setHashes({ "SHA-1": "", "SHA-256": "", "SHA-384": "", "SHA-512": "" });
      return;
    }
    setIsProcessing(true);
    try {
      const results = await Promise.all(
        ALGORITHMS.map(async (alg) => [alg, await computeHash(text, alg)] as const)
      );
      setHashes(Object.fromEntries(results) as Record<Algorithm, string>);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleInputChange = (text: string) => {
    setInput(text);
    setFileName("");
    hashText(text);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setInput("");
    setIsProcessing(true);
    try {
      const results = await Promise.all(
        ALGORITHMS.map(async (alg) => [alg, await computeFileHash(file, alg)] as const)
      );
      setHashes(Object.fromEntries(results) as Record<Algorithm, string>);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Panel>
        <div className="space-y-4">
          <Textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Enter text to hash..."
            className="h-32 font-[family-name:var(--font-mono)] text-sm"
          />
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-[var(--surface-secondary)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] cursor-pointer hover:border-[var(--border-hover)] transition-colors">
              📁 Hash a file
              <input type="file" onChange={handleFileChange} className="hidden" />
            </label>
            {fileName && (
              <span className="text-sm text-[var(--text-secondary)]">
                File: <strong>{fileName}</strong>
              </span>
            )}
            {isProcessing && (
              <span className="text-sm text-[var(--text-tertiary)]">Computing...</span>
            )}
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-[var(--text-primary)]">Hash Results</h3>
          {ALGORITHMS.map((alg) => (
            <HashRow key={alg} label={alg} value={hashes[alg]} />
          ))}
        </div>
      </Panel>
    </div>
  );
}
