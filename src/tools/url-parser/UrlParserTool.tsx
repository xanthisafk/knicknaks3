import { useState } from "react";
import { Input, Button } from "@/components/ui";
import { Panel } from "@/components/layout";

interface ParsedUrl {
  protocol: string;
  username: string;
  password: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  href: string;
  params: { key: string; value: string; decoded: string }[];
  pathSegments: string[];
}

function parseUrl(raw: string): ParsedUrl | null {
  try {
    let url = raw.trim();
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    const u = new URL(url);
    const params: { key: string; value: string; decoded: string }[] = [];
    u.searchParams.forEach((value, key) => {
      params.push({ key, value, decoded: decodeURIComponent(value) });
    });
    const pathSegments = u.pathname.split("/").filter(Boolean);
    return {
      protocol: u.protocol,
      username: u.username,
      password: u.password,
      hostname: u.hostname,
      port: u.port,
      pathname: u.pathname,
      search: u.search,
      hash: u.hash,
      origin: u.origin,
      href: u.href,
      params,
      pathSegments,
    };
  } catch {
    return null;
  }
}

function Field({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  if (!value) return null;
  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };
  return (
    <div className="flex items-start gap-3 py-2 border-b border-[var(--border-subtle)] last:border-b-0">
      <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-widest w-24 shrink-0 pt-0.5">
        {label}
      </span>
      <span
        className={`flex-1 text-sm text-[var(--text-primary)] break-all ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
      <button
        onClick={handleCopy}
        className="text-xs text-[var(--text-tertiary)] hover:text-[var(--color-primary-500)] transition-colors shrink-0"
      >
        {copied ? "✓" : "copy"}
      </button>
    </div>
  );
}

export default function UrlParserTool() {
  const [raw, setRaw] = useState("");
  const [encode, setEncode] = useState(false);

  const parsed = parseUrl(raw);
  const isValid = raw.trim() !== "" && parsed !== null;
  const isInvalid = raw.trim() !== "" && parsed === null;

  return (
    <div className="space-y-6">
      <Panel>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
              URL Input
            </label>
            <Input
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder="https://example.com/path?foo=bar&baz=qux#section"
              className={`font-mono text-sm ${isInvalid ? "border-red-400" : ""}`}
            />
            {isInvalid && (
              <p className="text-xs text-red-500 mt-1">Could not parse this URL.</p>
            )}
          </div>

          {raw && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="urlencode"
                checked={encode}
                onChange={(e) => setEncode(e.target.checked)}
                className="rounded accent-[var(--color-primary-500)]"
              />
              <label htmlFor="urlencode" className="text-sm text-[var(--text-secondary)]">
                Show URL-encoded values
              </label>
            </div>
          )}
        </div>
      </Panel>

      {parsed && (
        <>
          {/* Visual breakdown */}
          <Panel>
            <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-3">
              URL Breakdown
            </h3>
            <div className="font-mono text-sm break-all leading-loose">
              {parsed.protocol && (
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded px-1">
                  {parsed.protocol}//
                </span>
              )}
              {(parsed.username || parsed.password) && (
                <span className="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 rounded px-1">
                  {parsed.username}{parsed.password ? `:${parsed.password}` : ""}@
                </span>
              )}
              <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded px-1">
                {parsed.hostname}
              </span>
              {parsed.port && (
                <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded px-1">
                  :{parsed.port}
                </span>
              )}
              {parsed.pathname !== "/" && (
                <span className="bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 rounded px-1">
                  {parsed.pathname}
                </span>
              )}
              {parsed.search && (
                <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded px-1">
                  {parsed.search}
                </span>
              )}
              {parsed.hash && (
                <span className="bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 rounded px-1">
                  {parsed.hash}
                </span>
              )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-3">
              {[
                { label: "Protocol", color: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300" },
                { label: "Host", color: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300" },
                { label: "Port", color: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300" },
                { label: "Path", color: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300" },
                { label: "Query", color: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" },
                { label: "Hash", color: "bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300" },
              ].map(({ label, color }) => (
                <span key={label} className={`text-xs px-2 py-0.5 rounded font-medium ${color}`}>
                  {label}
                </span>
              ))}
            </div>
          </Panel>

          {/* Components */}
          <Panel>
            <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-2">
              Components
            </h3>
            <Field label="Protocol" value={parsed.protocol} />
            <Field label="Origin" value={parsed.origin} />
            <Field label="Hostname" value={parsed.hostname} />
            {parsed.port && <Field label="Port" value={parsed.port} />}
            {parsed.username && <Field label="Username" value={parsed.username} />}
            {parsed.password && <Field label="Password" value={parsed.password} />}
            <Field label="Path" value={parsed.pathname} />
            {parsed.hash && <Field label="Hash" value={parsed.hash.replace("#", "")} />}
          </Panel>

          {/* Path segments */}
          {parsed.pathSegments.length > 0 && (
            <Panel>
              <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-3">
                Path Segments
              </h3>
              <div className="flex flex-wrap gap-2">
                {parsed.pathSegments.map((seg, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="text-[var(--text-tertiary)] font-mono">/</span>
                    <span className="font-mono text-sm px-2 py-1 rounded-[var(--radius-sm)] bg-[var(--surface-elevated)] border border-[var(--border-default)] text-[var(--text-primary)]">
                      {seg}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {/* Query params */}
          {parsed.params.length > 0 && (
            <Panel>
              <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-3">
                Query Parameters ({parsed.params.length})
              </h3>
              <div className="space-y-1">
                {parsed.params.map(({ key, value, decoded }, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 rounded-[var(--radius-sm)] bg-[var(--surface-bg)] border border-[var(--border-subtle)] px-3 py-2"
                  >
                    <span className="font-mono text-sm text-[var(--color-primary-500)] font-semibold shrink-0">
                      {key}
                    </span>
                    <span className="text-[var(--text-tertiary)] font-mono">=</span>
                    <span className="font-mono text-sm text-[var(--text-primary)] break-all">
                      {encode ? value : decoded}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </>
      )}

      <Panel>
        <h3 className="text-[10px] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase mb-4">Tips</h3>
        <ul className="text-sm text-[var(--text-secondary)] space-y-2 list-disc list-inside">
          <li>You can omit the protocol — <code>https://</code> will be assumed.</li>
          <li>Toggle "Show URL-encoded values" to see raw percent-encoded query values.</li>
          <li>Click "copy" next to any field to copy just that component.</li>
        </ul>
      </Panel>
    </div>
  );
}