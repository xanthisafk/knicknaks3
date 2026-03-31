import { useCallback, useMemo, useState } from "react";
import { stringify } from "smol-toml";
import { Box, Container } from "@/components/layout/Primitive";
import { Panel } from "@/components/layout";
import { Button, ExpectContent, InlineFileDrop, Input, Textarea } from "@/components/ui";
import CodeBlock from "@/components/advanced/CodeBlock";
import { Download } from "lucide-react";
import { download, getFileSize, normalizeFileName } from "@/lib";
import { useToast } from "@/hooks/useToast";

export default function JsonToTomlTool() {
  const [input, setInput] = useState("");
  const [fileName, setFileName] = useState("");
  const toast = useToast();

  const output = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return null;
    try {
      const parsed = JSON.parse(trimmed);
      return stringify(parsed);
    } catch {
      return null;
    }
  }, [input]);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setInput(e.target?.result as string);
    };
    reader.readAsText(file);
    toast.success(`Loaded ${file.name}`);
  }, [toast]);

  const handleChange = useCallback((text: string) => {
    setInput(text);
  }, []);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const name = normalizeFileName(fileName || "output", ".toml");
    download(output, name);
  }, [output, fileName]);

  return (
    <Container cols={2}>
      <Box>
        <Panel>
          <Textarea
            label="JSON Input"
            value={input}
            placeholder="Paste your JSON here..."
            onChange={(e) => handleChange(e.target.value)}
            handlePaste={handleChange}
            onClear={() => handleChange("")}
          />
          <InlineFileDrop
            onUpload={(f) => handleFile(f.file)}
            accepts=".json"
            text="Upload JSON"
            variant="full"
          />
        </Panel>
        {output && (
          <Panel>
            <Input
              label="File Name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              handlePaste={setFileName}
              trailingText=".toml"
              placeholder="output"
              helperText={`Est. File Size: ${getFileSize(output)}`}
            />
            <Button
              onClick={handleDownload}
              icon={Download}
              variant="primary"
              className="w-full"
            >
              Download TOML
            </Button>
          </Panel>
        )}
      </Box>
      <Box>
        <Panel>
          {output ? (
            <div className="max-h-200 overflow-y-auto">
              <CodeBlock code={output} langHint="toml" label="TOML Output" />
            </div>
          ) : (
            <ExpectContent text="TOML will appear here" emoji="🧩" />
          )}
        </Panel>
      </Box>
    </Container>
  );
}
