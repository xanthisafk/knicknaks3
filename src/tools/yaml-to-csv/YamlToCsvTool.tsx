import Papa from "papaparse";
import { parse } from "yaml";
import { flattenObject, type CsvParseOptions } from "@/lib";
import { DEFAULT_CSV_PARSE_OPTIONS, download, getFileSize, normalizeFileName } from "@/lib";
import { Box, Container } from "@/components/layout/Primitive";
import { useCallback, useMemo, useState } from "react";
import { Button, CopyButton, ExpectContent, InlineFileDrop, Input, Label, Textarea, Toggle, Tooltip } from "@/components/ui";
import { Panel } from "@/components/layout";
import { useToast } from "@/hooks/useToast";
import { Download, Repeat2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function YamlToCsvTool() {
  const [input, setInput] = useState("");
  const [fileName, setFileName] = useState("");
  const [options, setOptions] = useState<Pick<CsvParseOptions, "delimiter" | "header" | "skipEmptyLines">>({
    delimiter: DEFAULT_CSV_PARSE_OPTIONS.delimiter,
    header: DEFAULT_CSV_PARSE_OPTIONS.header,
    skipEmptyLines: DEFAULT_CSV_PARSE_OPTIONS.skipEmptyLines,
  });
  const [previewMode, setPreviewMode] = useState<"table" | "raw">("table");

  const toast = useToast();

  const output = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return null;
    try {
      const parsed = parse(trimmed);
      if (!parsed || typeof parsed !== "object") return null;

      const normalized: Record<string, unknown>[] = Array.isArray(parsed)
        ? parsed.map((item) =>
          item !== null && typeof item === "object" && !Array.isArray(item)
            ? flattenObject(item as Record<string, unknown>)
            : {}
        )
        : [flattenObject(parsed as Record<string, unknown>)];

      return Papa.unparse(normalized, {
        delimiter: options.delimiter || ",",
        header: options.header,
        skipEmptyLines: options.skipEmptyLines,
      });
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
    setFileName("");
    setOptions({
      delimiter: DEFAULT_CSV_PARSE_OPTIONS.delimiter,
      header: DEFAULT_CSV_PARSE_OPTIONS.header,
      skipEmptyLines: DEFAULT_CSV_PARSE_OPTIONS.skipEmptyLines,
    });
  };

  const handleDownload = useCallback(() => {
    if (!output) return;
    const name = normalizeFileName(fileName || "output", ".csv");
    download(output, name);
  }, [output, fileName]);

  const tableData = useMemo(() => {
    if (!output) return null;
    return Papa.parse<Record<string, string>>(output, {
      header: true,
      delimiter: options.delimiter || ",",
    });
  }, [output, options.delimiter]);

  return (
    <Container cols={2}>
      <Box>
        <Panel>
          <Textarea
            label="YAML Input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            handlePaste={setInput}
            onClear={handleReset}
          />
          <InlineFileDrop
            onUpload={f => handleFile(f.file)}
            accepts=".yaml,.yml"
            variant="full"
          />
          <Label>Options</Label>
          <Container cols={2}>
            <Toggle
              label="Header"
              checked={options.header}
              onChange={(v) => setOptions({ ...options, header: v })}
            />
            <Toggle
              label="Skip Empty Lines"
              checked={options.skipEmptyLines}
              onChange={(v) => setOptions({ ...options, skipEmptyLines: v })}
            />
          </Container>
        </Panel>
        {output && (
          <Panel>
            <Input
              label="Filename"
              placeholder="output"
              trailingText=".csv"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              helperText={`Est. File Size: ${getFileSize(output)}`}
            />
            <Button icon={Download} onClick={handleDownload} className="w-full">
              Download CSV
            </Button>
          </Panel>
        )}
      </Box>
      <Box>
        <Panel>
          {output ? (
            <>
              <div className="flex flex-row justify-between items-center">
                <Label>CSV Preview</Label>
                <div className="flex flex-row gap-2">
                  <Tooltip content={previewMode === "table" ? "Switch to Raw View" : "Switch to Table View"}>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Repeat2}
                      onClick={() => setPreviewMode(previewMode === "table" ? "raw" : "table")}
                    />
                  </Tooltip>
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
                          <TableRow key={i}>
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
                  <Textarea value={output} readOnly allowCopy={false} rows={15} />
                </div>
              )}
            </>
          ) : (
            <ExpectContent text="CSV will appear here" emoji="🧩" />
          )}
        </Panel>
      </Box>
    </Container>
  );
}