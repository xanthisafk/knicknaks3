import { useState } from "react";
import { Input, Button } from "@/components/ui";
import { Panel } from "@/components/layout";

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
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
    if (!builtUrl) return;
    navigator.clipboard.writeText(builtUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="space-y-6">
      {/* Base URL */}
      <Panel>
        <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-4">
          Base URL
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Protocol */}
          <div className="flex rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-default)] h-10 shrink-0">
            {["https", "http"].map((p) => (
              <button
                key={p}
                onClick={() => setProtocol(p)}
                className={`px-3 text-sm font-mono border-r border-[var(--border-default)] last:border-r-0 transition-colors ${protocol === p
                  ? "bg-[var(--color-primary-500)] text-white"
                  : "bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="flex-1">
            <Input
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="example.com"
              className="font-mono"
            />
          </div>
          <div className="w-24">
            <Input
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="Port"
              className="font-mono"
            />
          </div>
        </div>
        <div className="mt-3">
          <Input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/path/to/resource"
            className="font-mono"
            label="Path"
          />
        </div>
      </Panel>

      {/* Query Params */}
      <Panel>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase">
            Query Parameters
          </h3>
          <Button variant="secondary" className="text-sm px-3 py-1.5" onClick={addParam}>
            + Add Param
          </Button>
        </div>

        <div className="space-y-2">
          {params.map((param) => (
            <div key={param.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={param.enabled}
                onChange={(e) => updateParam(param.id, "enabled", e.target.checked)}
                className="rounded accent-[var(--color-primary-500)] w-4 h-4 shrink-0"
              />
              <div className="flex-1">
                <Input
                  value={param.key}
                  onChange={(e) => updateParam(param.id, "key", e.target.value)}
                  placeholder="key"
                  className={`font-mono text-sm ${!param.enabled ? "opacity-40" : ""}`}
                />
              </div>
              <span className="text-[var(--text-tertiary)] font-mono">=</span>
              <div className="flex-1">
                <Input
                  value={param.value}
                  onChange={(e) => updateParam(param.id, "value", e.target.value)}
                  placeholder="value"
                  className={`font-mono text-sm ${!param.enabled ? "opacity-40" : ""}`}
                />
              </div>
              <button
                onClick={() => removeParam(param.id)}
                className="text-[var(--text-tertiary)] hover:text-red-500 transition-colors px-1 text-lg leading-none"
                aria-label="Remove param"
              >
                x
              </button>
            </div>
          ))}
        </div>
      </Panel>

      {/* Fragment */}
      <Panel>
        <Input
          value={fragment}
          onChange={(e) => setFragment(e.target.value)}
          placeholder="section-id"
          label="Fragment (#)"
          className="font-mono"
        />
      </Panel>

      {/* Output */}
      <Panel>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase">
            Built URL
          </h3>
          <Button
            variant={copied ? "secondary" : "primary"}
            className="px-4 py-1.5 text-sm"
            onClick={handleCopy}
            disabled={!builtUrl}
          >
            {copied ? "✓ Copied" : "Copy URL"}
          </Button>
        </div>
        <div
          className={`rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-bg)] p-3 font-mono text-sm break-all min-h-[3rem] ${builtUrl ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)] italic"
            }`}
        >
          {builtUrl || "Fill in the fields above to build a URL..."}
        </div>

        {builtUrl && (
          <div className="mt-3 flex flex-wrap gap-2">
            {(() => {
              try {
                const u = new URL(builtUrl);
                return [
                  { label: "Protocol", val: u.protocol },
                  { label: "Host", val: u.hostname },
                  u.port ? { label: "Port", val: u.port } : null,
                  u.pathname !== "/" ? { label: "Path", val: u.pathname } : null,
                  u.search ? { label: "Query", val: u.search } : null,
                  u.hash ? { label: "Hash", val: u.hash } : null,
                ]
                  .filter(Boolean)
                  .map(({ label, val }) => (
                    <span
                      key={label}
                      className="text-xs font-mono px-2 py-1 rounded-full bg-[var(--surface-elevated)] border border-[var(--border-default)] text-[var(--text-secondary)]"
                    >
                      <span className="text-[var(--text-tertiary)]">{label}: </span>
                      {val}
                    </span>
                  ));
              } catch {
                return null;
              }
            })()}
          </div>
        )}
      </Panel>
    </div>
  );
}