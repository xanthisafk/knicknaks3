import Papa from "papaparse";
import { Box, Container, FloatingContainer } from "@/components/layout/Primitive";
import { useCallback, useMemo, useState } from "react";
import { download, getFileSize, normalizeFileName } from "@/lib";
import { Panel } from "@/components/layout";
import { Button, CopyButton, ExpectContent, InlineFileDrop, Input, Label, Textarea, Toggle, Tooltip } from "@/components/ui";
import { Download, Repeat2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CsvParseOptions } from "@/lib"
import { DEFAULT_CSV_PARSE_OPTIONS } from "@/lib"


export default function JsonToCsvTool() {
  const [input, setInput] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [options, setOptions] = useState<CsvParseOptions>(DEFAULT_CSV_PARSE_OPTIONS);
  const [previewMode, setPreviewMode] = useState<"table" | "raw">("table");

  const output = useMemo<string | null>(() => {
    const trimmed = input.trim();
    if (!trimmed) return null;
    try {
      const parsed = JSON.parse(trimmed);
      const data = Array.isArray(parsed) ? parsed : [parsed];
      return Papa.unparse(data, {
        delimiter: options.delimiter || ",",
        header: options.header,
        skipEmptyLines: options.skipEmptyLines,
      });
    } catch {
      return null;
    }
  }, [input, options]);

  const handleText = useCallback((text: string) => {
    setInput(text);
  }, []);

  const handleFile = useCallback((uploadedFile: File) => {
    setFile(uploadedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      setInput((e.target?.result as string) ?? "");
    };
    reader.readAsText(uploadedFile);
  }, []);

  const handleOptionChange = useCallback(
    <K extends keyof CsvParseOptions>(option: K, value: CsvParseOptions[K]) => {
      setOptions((prev) => ({ ...prev, [option]: value }));
    },
    []
  );

  const handleDownload = useCallback(() => {
    if (!output) return;
    const name = normalizeFileName(fileName || "output", ".csv");
    download(output, name);
  }, [output, fileName]);

  const outputReady = !!output;

  // Parse the CSV output into rows for the preview table
  const tableData = useMemo(() => {
    if (!output) return null;
    const result = Papa.parse<Record<string, string>>(output, { header: true, delimiter: options.delimiter || "," });
    return result;
  }, [output]);

  return (
    <Container cols={1}>
      <Box>
        <Panel>
          <Textarea
            label="JSON Input"
            value={input}
            placeholder="Paste your JSON here..."
            onChange={(e) => handleText(e.target.value)}
            handlePaste={handleText}
            onClear={() => (handleText(""), setFile(null))}
          />
          <InlineFileDrop
            onUpload={(f) => handleFile(f.file)}
            accepts=".json"
            text={file ? file.name : "Upload JSON"}
            variant="full"
          />
          <Input
            label="Separator"
            value={options.delimiter}
            onChange={(e) => handleOptionChange("delimiter", e.target.value)}
            placeholder=","
          />
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <Label>Options</Label>

            <Toggle
              label="Header"
              checked={options.header}
              onChange={() => handleOptionChange("header", !options.header)}
            />
            <Toggle
              label="Skip Empty Lines"
              checked={options.skipEmptyLines}
              onChange={() => handleOptionChange("skipEmptyLines", !options.skipEmptyLines)}
            />
          </div>
        </Panel>
      </Box>
      <Box>
        <Panel>

          {output ? (
            <>
              <div className="flex flex-row justify-between items-center">
                <Label>CSV Preview</Label>
                <div className="flex flex-row gap-2">
                  <Tooltip content={previewMode === "table" ? "Switch to Raw View" : "Switch to Table View"}><Button
                    variant="ghost"
                    size="sm"
                    icon={Repeat2}
                    onClick={() => setPreviewMode(previewMode === "table" ? "raw" : "table")}
                  /></Tooltip>
                  <CopyButton text={output} />
                </div>
              </div>
              {previewMode === "table" ? (
                <div className="max-h-200 overflow-y-auto">
                  {tableData && tableData.data.length > 0 && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {tableData.meta.fields?.map((field, i) => (
                            <TableHead key={`${i}-${field}`}>{field}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tableData.data.map((row, i) => (
                          <TableRow key={`${i}-${row[i]}`}>
                            {tableData.meta.fields?.map((field) => (
                              <TableCell key={`${i}-${field}`}>{row[field]}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              ) : (
                <div className="max-h-200 overflow-y-auto">
                  <Textarea value={output} readOnly allowCopy={false} />
                </div>
              )}
            </>
          ) : (
            <ExpectContent text="CSV will appear here" emoji="🧩" />
          )}
        </Panel>
      </Box>
      {output && <FloatingContainer className="flex flex-col gap-3">
        <Input
          label="File Name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          handlePaste={setFileName}
          trailingText=".csv"
          placeholder="output"
          helperText={output ? `Est. File Size: ${getFileSize(output)}` : ""}
        />
        <Button
          onClick={handleDownload}
          icon={Download}
          disabled={!outputReady}
          variant="primary"
          className="w-full"
        >
          Download CSV
        </Button>
      </FloatingContainer>}
    </Container>
  );
}