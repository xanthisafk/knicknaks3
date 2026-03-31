import Papa from "papaparse";
import { stringify } from "yaml";
import type { CsvParseOptions } from "@/lib";
import { DEFAULT_CSV_PARSE_OPTIONS, download, getFileSize, normalizeFileName } from "@/lib";
import { Box, Container } from "@/components/layout/Primitive";
import { useCallback, useMemo, useState } from "react";
import { Button, ExpectContent, InlineFileDrop, Input, Label, Textarea, Toggle } from "@/components/ui";
import { Panel } from "@/components/layout";
import CodeBlock from "@/components/advanced/CodeBlock";
import { useToast } from "@/hooks/useToast";
import { Download } from "lucide-react";


export default function CsvToYamlTool() {
  const [input, setInput] = useState("");
  const [fileName, setFileName] = useState("");
  const [options, setOptions] = useState<CsvParseOptions>(DEFAULT_CSV_PARSE_OPTIONS);

  const toast = useToast();

  const output = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return null;
    try {
      const parsed = Papa.parse(trimmed, options);
      return stringify(parsed.data);
    } catch {
      return null;
    }
  }, [input, options]);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setInput(e.target?.result as string);
    };
    reader.readAsText(file);
    toast.success(`Loaded ${file.name}`);
  };

  const handleReset = () => {
    setInput("");
    setOptions(DEFAULT_CSV_PARSE_OPTIONS);
  };

  const handleDownload = useCallback(() => {
    if (!output) return;
    const name = normalizeFileName(fileName || "output", ".yaml");
    download(output, name);
  }, [output, fileName]);

  return (
    <Container cols={2}>
      <Box>
        <Panel>
          <Textarea
            label="CSV Input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            handlePaste={setInput}
            onClear={handleReset}
          />
          <InlineFileDrop
            onUpload={f => handleFile(f.file)}
            accepts=".csv"
            variant="full"
          />
          <Input
            label="Separator"
            value={options.delimiter}
            onChange={(e) => setOptions({ ...options, delimiter: e.target.value })}
          />
          <Label>Options</Label>
          <Container cols={2}>
            <Toggle
              label="Header"
              checked={options.header}
              onChange={(v) => setOptions({ ...options, header: v })}
            />
            <Toggle
              label="Dynamic Typing"
              checked={options.dynamicTyping}
              onChange={(v) => setOptions({ ...options, dynamicTyping: v })}
            />
            <Toggle
              label="Skip Empty Lines"
              checked={options.skipEmptyLines}
              onChange={(v) => setOptions({ ...options, skipEmptyLines: v })}
            />
          </Container>
        </Panel>
        {output && <Panel>
          <Input
            label="Filename"
            placeholder="output"
            trailingText=".yaml"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            helperText={output ? `Est. File Size: ${getFileSize(output)}` : ""}
          />
          <Button
            icon={Download}
            onClick={handleDownload}
            className="w-full"
          >Download YAML</Button>
        </Panel>}

      </Box>
      <Box>
        <Panel className="max-h-200 overflow-y-auto">
          {output ? <CodeBlock
            label="YAML Output"
            code={output || ""}
            langHint="yaml"
          /> : <ExpectContent text="YAML will appear here" emoji="🧩" />}
        </Panel>
      </Box>
    </Container>
  );
}
