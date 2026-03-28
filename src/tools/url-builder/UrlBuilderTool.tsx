import { useState } from "react";
import { Input, Button, Label, Toggle } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Box, Container } from "@/components/layout/Primitive";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { ResultRow } from "@/components/advanced/ResultRow";

interface QueryParam {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

function buildUrl(
  protocol: string,
  host: string,
  port: string,
  path: string,
  params: QueryParam[],
  fragment: string
): string {
  if (!host) return "";
  try {
    const cleanHost = host.replace(/^https?:\/\//, "");
    const portPart = port ? `:${port}` : "";
    const cleanPath = path.startsWith("/") ? path : path ? `/${path}` : "";
    const activeParams = params.filter((p) => p.enabled && p.key);
    const query =
      activeParams.length > 0
        ? "?" +
        activeParams
          .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
          .join("&")
        : "";
    const hash = fragment ? `#${fragment}` : "";
    return `${protocol}://${cleanHost}${portPart}${cleanPath}${query}${hash}`;
  } catch {
    return "";
  }
}

let idCounter = 0;
const newParam = (): QueryParam => ({
  id: String(++idCounter),
  key: "",
  value: "",
  enabled: true,
});

export default function UrlBuilderTool() {
  const [protocol, setProtocol] = useState("https");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [path, setPath] = useState("");
  const [params, setParams] = useState<QueryParam[]>([newParam()]);
  const [fragment, setFragment] = useState("");

  const builtUrl = buildUrl(protocol, host, port, path, params, fragment);

  const updateParam = (id: string, field: keyof QueryParam, value: string | boolean) => {
    setParams((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const addParam = () => setParams((prev) => [...prev, newParam()]);

  const removeParam = (id: string) => {
    setParams((prev) => {
      const next = prev.filter((p) => p.id !== id);
      return next.length === 0 ? [newParam()] : next;
    });
  };

  return (
    <Container>
      <Panel>
        <Container customCols="1fr 3fr 1fr">
          <Select
            label="Protocol"
            value={protocol}
            onValueChange={v => setProtocol(v)}
          >
            <SelectTrigger>
              {protocol.toUpperCase()}
            </SelectTrigger>
            <SelectContent>
              {["https", "http", "ftp", "ws", "wss"].map((p) => (
                <SelectItem key={p} value={p}>
                  {p.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            label="Host"
            value={host}
            onChange={e => setHost(e.target.value)}
            handlePaste={setHost}
            placeholder="example.com"
            className="font-mono"
          />


          <Input
            label="Port"
            value={port}
            onChange={e => setPort(e.target.value)}
            handlePaste={setPort}
            placeholder="Port"
            className="font-mono"
          />

        </Container>
        <Input
          label="Path"
          value={path}
          onChange={e => setPath(e.target.value)}
          handlePaste={setPath}
          placeholder="/path/to/resource"
          className="font-mono"
        />
        <Input
          label="Fragment"
          value={fragment}
          onChange={e => setFragment(e.target.value)}
          handlePaste={setFragment}
          placeholder="Fragment"
          className="font-mono"
        />
      </Panel>
      <Panel>
        <div className="flex justify-between items-center">
          <Label>Query Parameters</Label>
          <Button variant="ghost" onClick={addParam} size="xs" icon={Plus}>
            Add Param
          </Button>
        </div>
        <Box>
          {params.map((param) => (
            <div className="flex items-center justify-between gap-2">
              <Toggle
                checked={param.enabled}
                onChange={v => updateParam(param.id, "enabled", v)}
              />
              <Input
                value={param.key}
                onChange={(e) => updateParam(param.id, "key", e.target.value)}
                placeholder="Key"
                className="font-mono flex-1"
              />
              <Input
                value={param.value}
                onChange={(e) => updateParam(param.id, "value", e.target.value)}
                placeholder="Value"
                className="font-mono flex-1"
              />
              <Button
                variant="ghost"
                onClick={() => removeParam(param.id)}
                size="xs"
                disabled={params.length === 1}
                icon={Trash2}
              />
            </div>
          ))}
        </Box>
      </Panel>
      {builtUrl && <Panel>
        <ResultRow label="Final URL" value={builtUrl} />
      </Panel>}
    </Container>

  );
}