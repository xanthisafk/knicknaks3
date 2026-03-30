import { useCallback, useMemo, useState } from "react";
import Papa from "papaparse";
import { Box, Container } from "@/components/layout/Primitive";
import { Panel } from "@/components/layout";
import { Button, ExpectContent, InlineFileDrop, Input, Label, Textarea, Toggle } from "@/components/ui";
import CodeBlock from "@/components/advanced/CodeBlock";
import { Download } from "lucide-react";
import { download, getFileSize, normalizeFileName } from "@/lib";

export interface ParseOptions {
  header: boolean;
  dynamicTyping: boolean;
  skipEmptyLines: boolean;
  metadata: boolean;
  delimiter: string;
}

const parseCsv = (input: string, options: ParseOptions) => {
  const result = Papa.parse(input, options);
  return options.metadata ? result : result.data;
};

const hasContent = (output: unknown): boolean => {
  if (output === null || output === undefined) return false;
  if (Array.isArray(output)) return output.length > 0;
  if (typeof output === "object") {
    const data = (output as { data?: unknown[] }).data;
    return Array.isArray(data) && data.length > 0;
  }
  return false;
};

const DEFAULT_OPTIONS: ParseOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  metadata: false,
  delimiter: ",",
};

export default function CsvToJsonTool() {
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [options, setOptions] = useState<ParseOptions>(DEFAULT_OPTIONS);

  const output = useMemo(
    () => (input.trim() ? parseCsv(input, options) : null),
    [input, options]
  );

  const handleFile = useCallback((uploadedFile: File) => {
    setFile(uploadedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      setInput(e.target?.result as string);
    };
    reader.readAsText(uploadedFile);
  }, []);

  const handleChange = useCallback((text: string) => {
    setInput(text);
  }, []);

  const handleOptionChange = useCallback(
    <K extends keyof ParseOptions>(option: K, value: ParseOptions[K]) => {
      setOptions((prev) => ({ ...prev, [option]: value }));
    },
    []
  );

  const handleDownload = useCallback(() => {
    if (!output) return;
    const name = normalizeFileName(fileName || "output", ".json");
    download(JSON.stringify(output, null, 2), name);
  }, [output, fileName]);

  const outputReady = input.trim().length > 0 && hasContent(output);
  const jsonString = outputReady ? JSON.stringify(output, null, 2) : null;

  return (
    <Container cols={2}>
      <Box>
        <Panel>
          <Textarea
            label="CSV Input"
            value={input}
            placeholder="Paste your CSV here..."
            onChange={(e) => handleChange(e.target.value)}
            handlePaste={handleChange}
            onClear={() => handleChange("")}
          />
          <InlineFileDrop
            onUpload={(f) => handleFile(f.file)}
            accepts=".csv"
            text={file ? file.name : "Upload CSV"}
            variant="full"
          />
        </Panel>
        <Panel>
          <Input
            label="Separator"
            value={options.delimiter}
            onChange={(e) => handleOptionChange("delimiter", e.target.value)}
          />
          <Label>Options</Label>
          <Container cols={2}>
            <Toggle
              label="Header"
              checked={options.header}
              onChange={() => handleOptionChange("header", !options.header)}
            />
            <Toggle
              label="Dynamic Typing"
              checked={options.dynamicTyping}
              onChange={() => handleOptionChange("dynamicTyping", !options.dynamicTyping)}
            />
            <Toggle
              label="Skip Empty Lines"
              checked={options.skipEmptyLines}
              onChange={() => handleOptionChange("skipEmptyLines", !options.skipEmptyLines)}
            />
            <Toggle
              label="Include Metadata"
              checked={options.metadata}
              onChange={() => handleOptionChange("metadata", !options.metadata)}
            />
          </Container>
        </Panel>
        <Panel>
          <Input
            label="File Name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            handlePaste={setFileName}
            trailingText=".json"
            placeholder="output"
            helperText={jsonString ? `Est. File Size: ${getFileSize(jsonString)}` : ""}
          />
          <Button
            onClick={handleDownload}
            icon={Download}
            disabled={!outputReady}
            variant="primary"
            className="w-full"
          >
            Download JSON
          </Button>
        </Panel>
      </Box>
      <Box>
        <Panel>
          {jsonString ? (
            <div className="max-h-200 overflow-y-auto">
              <CodeBlock code={jsonString} langHint="json" label="JSON Output" />
            </div>
          ) : (
            <ExpectContent text="JSON will appear here" emoji="🧩" />
          )}
        </Panel>
      </Box>
    </Container>
  );
}