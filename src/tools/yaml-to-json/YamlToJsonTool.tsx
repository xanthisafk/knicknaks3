import { useCallback, useMemo, useState } from "react";
import { parse } from "yaml";
import { Box, Container } from "@/components/layout/Primitive";
import { Panel } from "@/components/layout";
import { Button, ExpectContent, InlineFileDrop, Input, Textarea } from "@/components/ui";
import CodeBlock from "@/components/advanced/CodeBlock";
import { Download } from "lucide-react";
import { download, getFileSize, normalizeFileName } from "@/lib";
import { useToast } from "@/hooks/useToast";

export default function YamlToJsonTool() {
  const [input, setInput] = useState("");
  const [fileName, setFileName] = useState("");
  const toast = useToast();

  const output = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return null;
    try {
      const parsed = parse(trimmed);
      return JSON.stringify(parsed, null, 2);
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
    const name = normalizeFileName(fileName || "output", ".json");
    download(output, name);
  }, [output, fileName]);

  return (
    <Container cols={2}>
      <Box>
        <Panel>
          <Textarea
            label="YAML Input"
            value={input}
            placeholder="Paste your YAML here..."
            onChange={(e) => handleChange(e.target.value)}
            handlePaste={handleChange}
            onClear={() => handleChange("")}
          />
          <InlineFileDrop
            onUpload={(f) => handleFile(f.file)}
            accepts=".yaml,.yml"
            text="Upload YAML"
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
              trailingText=".json"
              placeholder="output"
              helperText={`Est. File Size: ${getFileSize(output)}`}
            />
            <Button
              onClick={handleDownload}
              icon={Download}
              variant="primary"
              className="w-full"
            >
              Download JSON
            </Button>
          </Panel>
        )}
      </Box>
      <Box>
        <Panel>
          {output ? (
            <div className="max-h-200 overflow-y-auto">
              <CodeBlock code={output} langHint="json" label="JSON Output" />
            </div>
          ) : (
            <ExpectContent text="JSON will appear here" emoji="🧩" />
          )}
        </Panel>
      </Box>
    </Container>
  );
}
