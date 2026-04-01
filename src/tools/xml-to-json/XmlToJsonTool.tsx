import { useCallback, useMemo, useState } from "react";
import { XMLParser } from "fast-xml-parser";
import { Box, Container } from "@/components/layout/Primitive";
import { Panel } from "@/components/layout";
import { Button, ExpectContent, InlineFileDrop, Input, Label, Textarea, Toggle } from "@/components/ui";
import CodeBlock from "@/components/advanced/CodeBlock";
import { AlertTriangle, Download } from "lucide-react";
import { download, getFileSize, normalizeFileName } from "@/lib";
import { useToast } from "@/hooks/useToast";

export default function XmlToJsonTool() {
  const [input, setInput] = useState("");
  const [fileName, setFileName] = useState("");
  const [ignoreAttributes, setIgnoreAttributes] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  const output = useMemo(() => {
    setError("");

    const trimmed = input.trim();
    if (!trimmed) return null;
    try {
      const parser = new XMLParser({
        ignoreAttributes,
      });
      const parsed = parser.parse(trimmed);
      if (Object.keys(parsed).length === 0) {
        setError("No root element found");
        return null;
      }

      return JSON.stringify(parsed, null, 2);
    } catch (e: any) {
      console.log(e.message);
      setError("Invalid XML");
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
    const name = normalizeFileName(fileName || "output", ".json");
    download(output, name);
  }, [output, fileName]);

  return (
    <Container cols={2}>
      <Box>
        <Panel>
          <Textarea
            label="XML Input"
            value={input}
            placeholder="Paste your XML here..."
            onChange={(e) => handleChange(e.target.value)}
            handlePaste={handleChange}
            onClear={() => handleChange("")}
          />
          <InlineFileDrop
            onUpload={(f) => handleFile(f.file)}
            accepts=".xml"
            text="Upload XML"
            variant="full"
          />
          <Toggle
            label="Ignore Attributes"
            checked={ignoreAttributes}
            onChange={setIgnoreAttributes}
          />
          {error && <><br /><Label variant="danger" icon={AlertTriangle}>{error}</Label></>}
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
