import { useState, useMemo } from "react";
import { Textarea, Button, Label, Input, Badge, Toggle } from "@/components/ui";
import { Panel } from "@/components/layout";
import { TriangleAlert, Check, X } from "lucide-react";
import CodeBlock from "@/components/advanced/CodeBlock";
import { jwtVerify, importSPKI, compactVerify } from "jose";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

// ── helpers ────────────────────────────────────────────────────────────────

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

function base64ToUint8Array(b64: string): Uint8Array {
  // Accept both standard base64 and base64url
  const standard = b64.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(standard);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

// ── types ──────────────────────────────────────────────────────────────────

interface DecodedJWT {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

type VerifyStatus = "idle" | "loading" | "valid" | "invalid";

// ── algorithm catalogue ────────────────────────────────────────────────────

const ALGORITHMS = [
  { value: "auto", label: "Auto Detect", group: "auto" },
  // HMAC
  { value: "HS256", label: "HS256 — HMAC SHA-256", group: "hmac" },
  { value: "HS384", label: "HS384 — HMAC SHA-384", group: "hmac" },
  { value: "HS512", label: "HS512 — HMAC SHA-512", group: "hmac" },
  // RSA PKCS1
  { value: "RS256", label: "RS256 — RSA SHA-256", group: "rsa" },
  { value: "RS384", label: "RS384 — RSA SHA-384", group: "rsa" },
  { value: "RS512", label: "RS512 — RSA SHA-512", group: "rsa" },
  // RSA-PSS
  { value: "PS256", label: "PS256 — RSA-PSS SHA-256", group: "pss" },
  { value: "PS384", label: "PS384 — RSA-PSS SHA-384", group: "pss" },
  { value: "PS512", label: "PS512 — RSA-PSS SHA-512", group: "pss" },
  // ECDSA
  { value: "ES256", label: "ES256 — ECDSA P-256", group: "ec" },
  { value: "ES384", label: "ES384 — ECDSA P-384", group: "ec" },
  { value: "ES512", label: "ES512 — ECDSA P-521", group: "ec" },
];

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

function isAsymmetricAlg(alg: string) {
  return alg.startsWith("RS") || alg.startsWith("ES") || alg.startsWith("PS");
}

// ── component ──────────────────────────────────────────────────────────────

export default function JwtDecoderTool() {
  const [token, setToken] = useState("");
  const [secret, setSecret] = useState("");
  const [selectedAlg, setSelectedAlg] = useState("auto");
  const [base64Secret, setBase64Secret] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>("idle");
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // ── derived state ────────────────────────────────────────────────────────

  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    return decodeJWT(token);
  }, [token]);

  const isInvalid = token.trim().length > 0 && !decoded;

  // Effective algorithm: user pick overrides auto-detected header value
  const headerAlg = decoded?.header?.alg as string | undefined;
  const effectiveAlg =
    selectedAlg === "auto" ? headerAlg ?? "" : selectedAlg;

  const asymmetric = effectiveAlg ? isAsymmetricAlg(effectiveAlg) : false;
  const secretLabel = asymmetric ? "Public Key (PEM)" : "Secret Key";
  const secretPlaceholder = asymmetric
    ? "-----BEGIN PUBLIC KEY-----\n..."
    : "your-secret-key";

  const isExpired = useMemo(() => {
    if (!decoded?.payload?.exp) return null;
    const exp = decoded.payload.exp as number;
    return Date.now() / 1000 > exp;
  }, [decoded]);

  // ── verification ─────────────────────────────────────────────────────────

  async function runVerify(currentToken: string, currentSecret: string) {
    const dec = decodeJWT(currentToken);
    if (!dec || !currentSecret.trim()) {
      setVerifyStatus("idle");
      setVerifyError(null);
      return;
    }

    setVerifyStatus("loading");
    setVerifyError(null);

    try {
      let key: CryptoKey | Uint8Array;

      if (asymmetric) {
        key = await importSPKI(currentSecret.trim(), effectiveAlg);
      } else {
        // HMAC: honour base64 toggle
        key = base64Secret
          ? base64ToUint8Array(currentSecret.trim())
          : new TextEncoder().encode(currentSecret.trim());
      }

      // --- Signature-only verification (expiry-agnostic) ---
      // compactVerify checks the cryptographic signature without any claim
      // validation (exp, nbf, iss, etc.), so an expired token with a valid
      // signature still returns "valid" here. Expiry is shown separately.
      await compactVerify(currentToken.trim(), key);

      setVerifyStatus("valid");
    } catch (err) {
      setVerifyStatus("invalid");
      setVerifyError(
        err instanceof Error ? err.message : "Verification failed"
      );
    }
  }

  function handleTokenChange(value: string) {
    setToken(value);
    setVerifyStatus("idle");
    setVerifyError(null);
    if (secret.trim()) runVerify(value, secret);
  }

  function handleSecretChange(value: string) {
    setSecret(value);
    if (value.trim() && token.trim()) {
      runVerify(token, value);
    } else {
      setVerifyStatus("idle");
      setVerifyError(null);
    }
  }

  function handleAlgChange(value: string) {
    setSelectedAlg(value);
    setVerifyStatus("idle");
    setVerifyError(null);
    if (secret.trim() && token.trim()) runVerify(token, secret);
  }

  function handleBase64Toggle(checked: boolean) {
    setBase64Secret(checked);
    setVerifyStatus("idle");
    setVerifyError(null);
    if (secret.trim() && token.trim()) runVerify(token, secret);
  }

  // ── render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      {/* ── Left column: inputs + status ── */}
      <div className="flex-1 max-h-fit flex flex-col gap-2">
        <Panel>
          <div className="space-y-3">
            {/* Algorithm selector */}
            <Select
              label="Signing Algorithm"
              value={selectedAlg}
              onValueChange={handleAlgChange}
            >
              <SelectTrigger>
                {ALGORITHMS.find((a) => a.value === selectedAlg)?.label ??
                  "Auto Detect"}
              </SelectTrigger>
              <SelectContent>
                {ALGORITHMS.map((a) => (
                  <SelectItem key={a.value} value={a.value}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Token input */}
            <Textarea
              value={token}
              label="Your JWT Token"
              onChange={(e) => handleTokenChange(e.target.value)}
              placeholder="Enter your token here..."
            />

            {/* Secret / public key */}
            <Input
              label={secretLabel}
              value={secret}
              onChange={(e) => handleSecretChange(e.target.value)}
              placeholder={secretPlaceholder}
            />

            {/* Base64 toggle — only shown for HMAC algorithms */}
            {!asymmetric && (
              <Toggle
                label="Base64 Encoded Secret"
                checked={base64Secret}
                onChange={v => handleBase64Toggle(v)}
              />
            )}
          </div>
        </Panel>

        {/* Status panel */}
        {isInvalid || isExpired !== null || verifyStatus === "valid" && (
          <Panel className="flex flex-col gap-2">
            {isInvalid && (
              <Label icon={TriangleAlert} size="s" variant="danger" role="alert">
                Invalid JWT format. A JWT should have 3 parts separated by dots.
              </Label>
            )}

            {isExpired !== null && (
              <Label
                icon={isExpired ? TriangleAlert : Check}
                variant={isExpired ? "danger" : "success"}
              >
                {isExpired ? "This token is expired" : "This token is not expired"}
              </Label>
            )}

            {verifyStatus === "valid" ? (
              <Label icon={Check} variant="success">
                Signature is valid{isExpired ? " (token expired)" : ""}
              </Label>
            ) : (
              <Label icon={X} variant="danger">
                {verifyError ?? "Signature is invalid"}
              </Label>
            )}
          </Panel>
        )}
      </div>

      {/* ── Right column: decoded output ── */}
      {!decoded && (
        <Panel className="flex-2 flex flex-col justify-center items-center">
          <span className="font-emoji text-6xl">🎫</span>
          <h3 className="text-(--text-secondary)">Enter a JWT token</h3>
        </Panel>
      )}

      {decoded && (
        <div className="flex flex-col gap-2 flex-2">
          <div className="flex flex-col md:flex-col gap-2">
            <Panel className="flex-1">
              <CodeBlock
                code={JSON.stringify(decoded.header, null, 2)}
                langHint="json"
                label="Header"
              />
            </Panel>
            <Panel className="flex-1">
              <CodeBlock
                code={JSON.stringify(decoded.payload, null, 2)}
                langHint="json"
                label="Payload"
              />
            </Panel>
          </div>

          <Panel padding="sm">
            <div className="flex items-center gap-2">
              <Label>Signature:</Label>
              <code className="text-xs font-mono break-all">
                {decoded.signature}
              </code>
              {verifyStatus === "valid" && (
                <Badge icon={Check} text="Valid" variant="success" />
              )}
              {verifyStatus === "invalid" && (
                <Badge icon={X} text="Invalid" variant="danger" />
              )}
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}