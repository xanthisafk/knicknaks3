import { useState, useCallback, useRef } from "react";
import { Button, Label, Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { ResultRow } from "@/components/advanced/ResultRow";
import { CornerDownLeft, Loader2 } from "lucide-react";

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
  const fileRef = useRef<HTMLInputElement>(null);

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
    <div className="space-y-2">
      <Panel>
        <div className="space-y-2">
          <Textarea
            label="Text to Hash"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Enter text to hash..."
          />
          <input ref={fileRef} type="file" onChange={handleFileChange} className="hidden" />
          <div className="flex flex-row justify-between items-center gap-1.5">
            <div className="flex flex-row items-center gap-1.5">
              <Button
                size="md"
                variant="secondary"
                emoji={fileName ? "📂" : "📁"}
                onClick={() => fileRef.current?.click()}
              >
                {fileName ? "Change File" : "Hash a file"}
              </Button>
              {fileName && (
                <Label>{fileName}</Label>
              )}
              {isProcessing &&
                <>
                  <Loader2 className="animate-spin size-4" /> <Label size="xs">Loading...</Label>
                </>
              }
            </div>
            <Button
              size="md"
              variant="ghost"
              icon={CornerDownLeft}
              onClick={() => handleInputChange("")}
            >
              Clear
            </Button>
          </div>
        </div>
      </Panel>

      <Panel>
        <div className="space-y-2">
          <Label>Hash Results</Label>
          {ALGORITHMS.map((alg) => (
            <ResultRow key={alg} label={alg} value={hashes[alg]} />
          ))}
        </div>
      </Panel>
    </div>
  );
}
