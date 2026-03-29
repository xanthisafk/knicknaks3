import { useState, useMemo, useCallback } from "react";
import { Input, Label, CopyButton, ExpectContent } from "@/components/ui";
import { Panel } from "@/components/layout";
import { Container } from "@/components/layout/Primitive";
import { ResultRow } from "@/components/advanced/ResultRow";
import { debounce } from "@/lib";

interface QueryParam {
  key: string;
  encodedValue: string;
  decodedValue: string;
}

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
  params: QueryParam[];
  pathSegments: string[];
}

type ParseResult =
  | { ok: true; data: ParsedUrl }
  | { ok: false; error: string }
  | { ok: null }; // empty input

function parseUrl(raw: string): ParseResult {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: null };

  try {
    const normalized = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : "https://" + trimmed;

    const u = new URL(normalized);

    const params: QueryParam[] = [];
    new URLSearchParams(u.search).forEach((decodedValue, key) => {
      const encodedValue = u.searchParams.get(key) ?? decodedValue;
      params.push({
        key,
        encodedValue,
        decodedValue,
      });
    });

    return {
      ok: true,
      data: {
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
        pathSegments: u.pathname.split("/").filter(Boolean),
      },
    };
  } catch {
    return { ok: false, error: "Invalid URL — couldn't be parsed." };
  }
}

export default function UrlParserTool() {
  const [raw, setRaw] = useState("");
  const [debouncedRaw, setDebouncedRaw] = useState("");

  const debouncedUpdate = useMemo(
    () => debounce((value: unknown) => setDebouncedRaw(value as string), 300),
    []
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setRaw(value);
      debouncedUpdate(value);
    },
    [debouncedUpdate]
  );

  const result = useMemo(() => parseUrl(debouncedRaw), [debouncedRaw]);

  const parsed = result.ok === true ? result.data : null;
  const errorMsg = result.ok === false ? result.error : null;

  return (
    <Container>
      <Panel>
        <Input
          label="URL"
          value={raw}
          onChange={handleChange}
          placeholder="https://example.com/path?fruit=apple&animal=horse#yippie"
          className="font-mono"
          aria-invalid={errorMsg != null}
          aria-describedby={errorMsg ? "url-error" : undefined}
        />
        {errorMsg && (
          <p id="url-error" className="mt-1 text-sm text-red-500">
            {errorMsg}
          </p>
        )}
      </Panel>
      {!parsed &&
        <Panel>
          <ExpectContent text="Enter a URL to parse" emoji="💮" />
        </Panel>
      }

      {parsed && (
        <Panel>
          <Label>Components</Label>
          {parsed.protocol && (
            <ResultRow label="Protocol" value={parsed.protocol} />
          )}
          {parsed.origin && <ResultRow label="Origin" value={parsed.origin} />}
          {parsed.hostname && (
            <ResultRow label="Hostname" value={parsed.hostname} />
          )}
          {parsed.port && <ResultRow label="Port" value={parsed.port} />}
          {parsed.username && (
            <ResultRow label="Username" value={parsed.username} />
          )}
          {parsed.password && (
            <ResultRow label="Password" value={parsed.password} />
          )}
          {parsed.pathname && (
            <ResultRow label="Path" value={parsed.pathname} />
          )}
          {parsed.search && <ResultRow label="Search" value={parsed.search} />}
          {parsed.hash && <ResultRow label="Hash" value={parsed.hash} />}
        </Panel>
      )}

      {parsed && parsed.pathSegments.length > 0 && (
        <Panel>
          <Label>Path Segments</Label>
          <div className="flex flex-wrap gap-1">
            {parsed.pathSegments.map((seg, index) => (
              <CopyButton
                key={index}
                size="m"
                text={seg}
                label={seg}
                iconPos="right"
                confirmCopy={false}
              />
            ))}
          </div>
        </Panel>
      )}

      {parsed && parsed.params.length > 0 && (
        <Panel>
          <Label>Query Parameters</Label>
          {parsed.params.map(({ key, encodedValue, decodedValue }) => (
            <div key={key} className="mb-3">
              <ResultRow label={key} value={decodedValue} />
              {encodedValue !== decodedValue && (
                <ResultRow
                  label={`${key} (encoded)`}
                  value={encodedValue}
                />
              )}
            </div>
          ))}
        </Panel>
      )}
    </Container>
  );
}