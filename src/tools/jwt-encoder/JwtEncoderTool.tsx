import { useState, useCallback } from "react";
import { Button, Label, Input, Toggle, Textarea } from "@/components/ui";
import { Panel } from "@/components/layout";
import { TriangleAlert, Check, Copy, Plus, Trash2, RefreshCw } from "lucide-react";
import CodeBlock from "@/components/advanced/CodeBlock";
import { SignJWT, importPKCS8, generateSecret, exportJWK } from "jose";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

// ── types ──────────────────────────────────────────────────────────────────

type SignStatus = "idle" | "loading" | "success" | "error";

interface ClaimRow {
  id: string;
  key: string;
  value: string;
  type: "string" | "number" | "boolean" | "json";
}

// ── algorithm catalogue ────────────────────────────────────────────────────

const ALGORITHMS = [
  { value: "HS256", label: "HS256 — HMAC SHA-256", asymmetric: false },
  { value: "HS384", label: "HS384 — HMAC SHA-384", asymmetric: false },
  { value: "HS512", label: "HS512 — HMAC SHA-512", asymmetric: false },
  { value: "RS256", label: "RS256 — RSA SHA-256", asymmetric: true },
  { value: "RS384", label: "RS384 — RSA SHA-384", asymmetric: true },
  { value: "RS512", label: "RS512 — RSA SHA-512", asymmetric: true },
  { value: "PS256", label: "PS256 — RSA-PSS SHA-256", asymmetric: true },
  { value: "PS384", label: "PS384 — RSA-PSS SHA-384", asymmetric: true },
  { value: "PS512", label: "PS512 — RSA-PSS SHA-512", asymmetric: true },
  { value: "ES256", label: "ES256 — ECDSA P-256", asymmetric: true },
  { value: "ES384", label: "ES384 — ECDSA P-384", asymmetric: true },
  { value: "ES512", label: "ES512 — ECDSA P-521", asymmetric: true },
];

// ── standard claim presets ─────────────────────────────────────────────────

const STD_CLAIMS: { key: string; placeholder: string; type: ClaimRow["type"] }[] = [
  { key: "sub", placeholder: "user_123", type: "string" },
  { key: "iss", placeholder: "https://my-app.com", type: "string" },
  { key: "aud", placeholder: "https://api.my-app.com", type: "string" },
];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function castValue(raw: string, type: ClaimRow["type"]): unknown {
  if (type === "number") return Number(raw);
  if (type === "boolean") return raw.toLowerCase() === "true";
  if (type === "json") {
    try { return JSON.parse(raw); } catch { return raw; }
  }
  return raw;
}

// ── component ──────────────────────────────────────────────────────────────

export default function JwtEncoderTool() {
  const [alg, setAlg] = useState("HS256");
  const [secret, setSecret] = useState("");
  const [base64Secret, setBase64Secret] = useState(false);

  // Expiry
  const [expiresIn, setExpiresIn] = useState("3600");
  const [noExpiry, setNoExpiry] = useState(false);

  // Custom payload claims (beyond std)
  const [claims, setClaims] = useState<ClaimRow[]>([
    { id: uid(), key: "sub", value: "", type: "string" },
    { id: uid(), key: "iss", value: "", type: "string" },
  ]);

  // Output
  const [signedToken, setSignedToken] = useState("");
  const [status, setStatus] = useState<SignStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const algMeta = ALGORITHMS.find((a) => a.value === alg)!;
  const isAsymmetric = algMeta.asymmetric;
  const secretLabel = isAsymmetric ? "Private Key (PEM / PKCS#8)" : "Secret Key";
  const secretPlaceholder = isAsymmetric
    ? "-----BEGIN PRIVATE KEY-----\n..."
    : "your-secret-key";

  // ── claim helpers ────────────────────────────────────────────────────────

  function addClaim() {
    setClaims((c) => [...c, { id: uid(), key: "", value: "", type: "string" }]);
  }

  function removeClaim(id: string) {
    setClaims((c) => c.filter((r) => r.id !== id));
  }

  function updateClaim(id: string, field: keyof ClaimRow, val: string) {
    setClaims((c) =>
      c.map((r) => (r.id === id ? { ...r, [field]: val } : r))
    );
  }

  // ── sign ─────────────────────────────────────────────────────────────────

  async function handleSign() {
    if (!secret.trim()) {
      setErrorMsg("Please enter a secret or private key.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg(null);
    setSignedToken("");

    try {
      // Build payload object from claim rows
      const payload: Record<string, unknown> = {};
      for (const row of claims) {
        if (row.key.trim()) {
          payload[row.key.trim()] = castValue(row.value, row.type);
        }
      }

      // Resolve signing key
      let key: CryptoKey | Uint8Array;
      if (isAsymmetric) {
        key = await importPKCS8(secret.trim(), alg);
      } else {
        key = base64Secret
          ? (() => {
            const std = secret.trim().replace(/-/g, "+").replace(/_/g, "/");
            const binary = atob(std);
            return Uint8Array.from(binary, (c) => c.charCodeAt(0));
          })()
          : new TextEncoder().encode(secret.trim());
      }

      // Build JWT
      let builder = new SignJWT(payload).setProtectedHeader({ alg });

      if (!noExpiry) {
        const secs = parseInt(expiresIn, 10);
        if (!isNaN(secs) && secs > 0) {
          builder = builder.setExpirationTime(Math.floor(Date.now() / 1000) + secs);
        }
      }

      builder = builder.setIssuedAt();

      const token = await builder.sign(key);
      setSignedToken(token);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Signing failed");
    }
  }

  // ── copy ─────────────────────────────────────────────────────────────────

  async function handleCopy() {
    if (!signedToken) return;
    await navigator.clipboard.writeText(signedToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-row gap-2">
      {/* ── Left column: config ── */}
      <div className="flex-1 flex flex-col gap-2">
        <Panel>
          <div className="space-y-3">
            {/* Algorithm */}
            <Select label="Signing Algorithm" value={alg} onValueChange={(v) => { setAlg(v); setStatus("idle"); setSignedToken(""); }}>
              <SelectTrigger>
                {algMeta.label}
              </SelectTrigger>
              <SelectContent>
                {ALGORITHMS.map((a) => (
                  <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Secret / private key */}
            <Input
              label={secretLabel}
              value={secret}
              onChange={(e) => { setSecret(e.target.value); setStatus("idle"); }}
              placeholder={secretPlaceholder}
            />

            {/* Base64 toggle — HMAC only */}
            {!isAsymmetric && (
              <Toggle
                label="Base64 Encoded Secret"
                checked={base64Secret}
                onChange={v => setBase64Secret(v)}
              />
            )}
          </div>
        </Panel>

        {/* Expiry */}
        <Panel>
          <div className="space-y-3">
            {!noExpiry && (
              <Input
                label="Expires In (seconds)"
                value={expiresIn}
                type="number"
                onChange={(e) => setExpiresIn(e.target.value)}
                placeholder="3600"
              />
            )}
            <Toggle
              label="No Expiry"
              checked={noExpiry}
              onChange={v => setNoExpiry(v)}
            />
          </div>
        </Panel>

        {/* Sign button + status */}
        <Button onClick={handleSign} disabled={status === "loading"}>
          {status === "loading" ? "Signing..." : "Sign Token"}
        </Button>

        {status === "error" && errorMsg && (
          <Panel>
            <Label icon={TriangleAlert} size="s" variant="danger">{errorMsg}</Label>
          </Panel>
        )}
      </div>

      {/* ── Right column: payload builder + output ── */}
      <div className="flex-2 flex flex-col gap-2">
        {/* Payload claims */}
        <Panel>
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <Label>Payload Claims</Label>
              <Button icon={Plus} size="sm" variant="ghost" onClick={addClaim}>
                Add Claim
              </Button>
            </div>

            {claims.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-[1fr_2fr_1fr_auto] gap-2 items-center"
              >
                <Input
                  placeholder="key"
                  value={row.key}
                  onChange={(e) => updateClaim(row.id, "key", e.target.value)}
                />

                <Input
                  placeholder="value"
                  value={row.value}
                  onChange={(e) => updateClaim(row.id, "value", e.target.value)}
                />

                <Select
                  value={row.type}
                  onValueChange={(v) =>
                    updateClaim(row.id, "type", v as ClaimRow["type"])
                  }
                >
                  <SelectTrigger className="w-full text-xs">
                    {row.type}
                  </SelectTrigger>
                  <SelectContent>
                    {(["string", "number", "boolean", "json"] as const).map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  onClick={() => removeClaim(row.id)}
                  aria-label="Remove claim"
                  title="Remove claim"
                  icon={Trash2}
                />
              </div>
            ))}
          </div>
        </Panel>

        {/* Output */}
        {status === "success" && signedToken && (
          <Panel className="flex flex-col gap-2">
            <Textarea
              readOnly
              value={signedToken}
              label="Signed JWT"
            />
            <Label icon={Check} variant="success">Token signed successfully</Label>
          </Panel>
        )}

        {status !== "success" && (
          <Panel className="flex flex-col justify-center items-center gap-2">
            <span className="font-emoji text-6xl">✍️</span>
            <h3 className="text-(--text-secondary)">Configure and sign your token</h3>
          </Panel>
        )}
      </div>
    </div>
  );
}