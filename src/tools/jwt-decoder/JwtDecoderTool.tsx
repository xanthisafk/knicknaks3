import { useState, useMemo } from "react";
import { Textarea, Button } from "@/components/ui";
import { Panel } from "@/components/layout";
import { copyToClipboard } from "@/lib/utils";

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  return decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")
  );
}

interface DecodedJWT {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

function decodeJWT(token: string): DecodedJWT | null {
  const parts = token.trim().split(".");
  if (parts.length !== 3) return null;
  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return { header, payload, signature: parts[2] };
  } catch {
    return null;
  }
}

function formatTimestamp(value: unknown): string | null {
  if (typeof value !== "number") return null;
  // Unix timestamps in JWT are in seconds
  if (value > 1e9 && value < 1e11) {
    return new Date(value * 1000).toLocaleString();
  }
  return null;
}

function ClaimRow({ name, value }: { name: string; value: unknown }) {
  const formatted = formatTimestamp(value);
  return (
    <div className="flex items-start gap-3 py-1.5">
      <code className="text-xs font-[family-name:var(--font-mono)] text-[var(--color-primary-600)] flex-shrink-0 min-w-[60px]">
        {name}
      </code>
      <div className="flex-1">
        <span className="text-sm text(--text-primary) break-all">
          {typeof value === "object" ? JSON.stringify(value) : String(value)}
        </span>
        {formatted && (
          <span className="text-xs text-[var(--text-tertiary)] ml-2">({formatted})</span>
        )}
      </div>
    </div>
  );
}

function JsonBlock({ title, data, color }: { title: string; data: Record<string, unknown>; color: string }) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    if (await copyToClipboard(json)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Panel>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            {title}
          </h3>
          <Button size="sm" variant="ghost" onClick={handleCopy}>
            {copied ? "✓ Copied!" : "📋 Copy"}
          </Button>
        </div>
        <pre className="text-xs font-[family-name:var(--font-mono)] bg-[var(--surface-secondary)] rounded-[var(--radius-md)] p-3 overflow-x-auto whitespace-pre-wrap text(--text-primary)">
          {json}
        </pre>
        <div className="divide-y divide-[var(--border-default)]">
          {Object.entries(data).map(([key, value]) => (
            <ClaimRow key={key} name={key} value={value} />
          ))}
        </div>
      </div>
    </Panel>
  );
}

export default function JwtDecoderTool() {
  const [token, setToken] = useState("");

  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    return decodeJWT(token);
  }, [token]);

  const isInvalid = token.trim().length > 0 && !decoded;

  // Check token expiration
  const isExpired = useMemo(() => {
    if (!decoded?.payload?.exp) return null;
    const exp = decoded.payload.exp as number;
    return Date.now() / 1000 > exp;
  }, [decoded]);

  return (
    <div className="space-y-2">
      <Panel>
        <div className="space-y-3">
          <label className="text-sm font-medium text(--text-primary)">Paste JWT Token</label>
          <Textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
            className="h-28 font-[family-name:var(--font-mono)] text-xs"
          />
          {isInvalid && (
            <p className="text-sm text-[var(--color-error)]" role="alert">
              ❌ Invalid JWT format. A JWT should have 3 parts separated by dots.
            </p>
          )}
          {isExpired !== null && (
            <p className={`text-sm font-medium ${isExpired ? "text-[var(--color-error)]" : "text-[var(--color-success)]"}`}>
              {isExpired ? "⚠️ This token is expired" : "✅ This token is still valid"}
            </p>
          )}
        </div>
      </Panel>

      {decoded && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <JsonBlock title="Header" data={decoded.header} color="var(--color-primary-500)" />
          <JsonBlock title="Payload" data={decoded.payload} color="var(--color-accent-500)" />
        </div>
      )}

      {decoded && (
        <Panel padding="sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text(--text-secondary)">Signature:</span>
            <code className="text-xs font-[family-name:var(--font-mono)] text-[var(--text-tertiary)] break-all">
              {decoded.signature}
            </code>
          </div>
        </Panel>
      )}
    </div>
  );
}
