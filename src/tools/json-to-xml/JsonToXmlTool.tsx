import { useCallback, useMemo, useState } from "react";
import { XMLBuilder } from "fast-xml-parser";
import { Box, Container } from "@/components/layout/Primitive";
import { Panel } from "@/components/layout";
import { Button, ExpectContent, InlineFileDrop, Input, Textarea, Toggle } from "@/components/ui";
import CodeBlock from "@/components/advanced/CodeBlock";
import { Download } from "lucide-react";
import { download, getFileSize, normalizeFileName } from "@/lib";
import { useToast } from "@/hooks/useToast";

export default function JsonToXmlTool() {
  const [input, setInput] = useState("");
  const [fileName, setFileName] = useState("");
  const [ignoreAttributes, setIgnoreAttributes] = useState(false);
  const toast = useToast();

  const output = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return null;
    try {
      const parsed = JSON.parse(trimmed);
      const builder = new XMLBuilder({
        format: true,
        ignoreAttributes,
      });
      return builder.build(parsed);
    } catch {
      return null;
    }
  }, [input, ignoreAttributes]);

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
    const name = normalizeFileName(fileName || "output", ".xml");
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
          <Toggle
            label="Ignore Attributes"
            checked={ignoreAttributes}
            onChange={setIgnoreAttributes}
          />
        </Panel>
        {output && (
          <Panel>
            <Input
              label="File Name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              handlePaste={setFileName}
              trailingText=".xml"
              placeholder="output"
              helperText={`Est. File Size: ${getFileSize(output)}`}
            />
            <Button
              onClick={handleDownload}
              icon={Download}
              variant="primary"
              className="w-full"
            >
              Download XML
            </Button>
          </Panel>
        )}
      </Box>
      <Box>
        <Panel>
          {output ? (
            <div className="max-h-200 overflow-y-auto">
              <CodeBlock code={output} langHint="xml" label="XML Output" />
            </div>
          ) : (
            <ExpectContent text="XML will appear here" emoji="🧩" />
          )}
        </Panel>
      </Box>
    </Container>
  );
}
