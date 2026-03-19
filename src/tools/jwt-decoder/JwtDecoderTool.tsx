import { useState, useMemo } from "react";
import { Textarea, Button, Label, Input, Badge } from "@/components/ui";
import { Panel } from "@/components/layout";
import { TriangleAlert, ShieldCheck, ShieldX, Loader2, Check, X } from "lucide-react";
import CodeBlock from "@/components/advanced/CodeBlock";
import { jwtVerify, importSPKI } from "jose";

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

type VerifyStatus = "idle" | "loading" | "valid" | "invalid";

export default function JwtDecoderTool() {
  const [token, setToken] = useState("");
  const [secret, setSecret] = useState("");
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>("idle");
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    return decodeJWT(token);
  }, [token]);

  const isInvalid = token.trim().length > 0 && !decoded;

  const alg = decoded?.header?.alg as string | undefined;
  const isAsymmetric = alg && (alg.startsWith("RS") || alg.startsWith("ES") || alg.startsWith("PS"));
  const secretLabel = isAsymmetric ? "Public Key (PEM)" : "Secret Key";
  const secretPlaceholder = isAsymmetric
    ? "-----BEGIN PUBLIC KEY-----\n..."
    : "your-secret-key";

  const isExpired = useMemo(() => {
    if (!decoded?.payload?.exp) return null;
    const exp = decoded.payload.exp as number;
    return Date.now() / 1000 > exp;
  }, [decoded]);

  async function handleVerify(e: React.ChangeEvent<HTMLInputElement>) {
    const secret = e.target.value;
    setSecret(secret);

    if (!token.trim() || !decoded || !secret.trim()) return;
    setVerifyStatus("loading");
    setVerifyError(null);

    try {
      let key: CryptoKey | Uint8Array;

      if (isAsymmetric) {
        key = await importSPKI(secret.trim(), alg!);
      } else {
        key = new TextEncoder().encode(secret.trim());
      }

      await jwtVerify(token.trim(), key, { algorithms: alg ? [alg] : undefined });
      setVerifyStatus("valid");
    } catch (err) {
      setVerifyStatus("invalid");
      setVerifyError(err instanceof Error ? err.message : "Verification failed");
    }
  }

  return (
    <div className="flex flex-row gap-2">
      <Panel className="flex-1">
        <div className="space-y-2">
          <Textarea
            value={token}
            label="Your JWT Token"
            onChange={(e) => {
              setToken(e.target.value);
              setVerifyStatus("idle");
              setVerifyError(null);
            }}
            placeholder="Enter your token here..."
          />
          <Input
            label={secretLabel}
            value={secret}
            onChange={handleVerify}
            placeholder={secretPlaceholder}
          />
          {isInvalid && (
            <Label icon={TriangleAlert} size="s" variant="danger" role="alert">
              Invalid JWT format. A JWT should have 3 parts separated by dots.
            </Label>
          )}
          {isExpired !== null && (
            <p className={`text-sm font-medium ${isExpired ? "text-(--color-error)" : "text-(--color-success)"}`}>
              {isExpired ? "⚠️ This token is expired" : "✅ This token is still valid"}
            </p>
          )}
        </div>
      </Panel>
      {!decoded &&
        <Panel className="flex-2">
          <p>Enter a JWT token to decode it.</p>
        </Panel>
      }

      {decoded &&
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
              {verifyStatus === "valid" && <Badge icon={Check} text="Valid" variant="success" />}
              {verifyStatus === "invalid" && <Badge icon={X} text="Invalid" variant="danger" />}
            </div>
          </Panel>

        </div>
      }
    </div>
  );
}