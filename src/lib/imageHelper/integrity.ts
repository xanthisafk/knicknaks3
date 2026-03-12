import { type IntegrityResult, SIGNATURES } from "./types";

export function checkIntegrity(file: File, headerBytes: Uint8Array): IntegrityResult {
    const issues: string[] = [];
    const notes: string[] = [];

    const claimedExt = file.name.split(".").pop()?.toLowerCase() ?? "";
    const claimedMime = file.type;

    const sig = SIGNATURES.find((s) => s.match(headerBytes));
    const detectedMime = sig?.mime ?? null;
    const detectedExt = sig?.ext ?? null;

    if (!sig) {
        issues.push("Could not identify file format from magic bytes. The file header is unrecognized or the file may be corrupt.");
    } else {
        const knownExtsForMime: Record<string, string[]> = {
            "image/jpeg": ["jpg", "jpeg", "jpe", "jfif"],
            "image/png": ["png"],
            "image/gif": ["gif"],
            "image/webp": ["webp"],
            "image/tiff": ["tif", "tiff"],
            "image/bmp": ["bmp"],
            "image/heic": ["heic", "heif"],
            "image/avif": ["avif"],
        };
        const validExts = knownExtsForMime[sig.mime] ?? [sig.ext];
        if (claimedExt && !validExts.includes(claimedExt)) {
            issues.push(`Extension mismatch: file is saved as .${claimedExt} but the container is ${sig.mime} (${sig.ext.toUpperCase()}).`);
        }

        if (claimedMime && claimedMime !== "application/octet-stream" && claimedMime !== sig.mime) {
            const bothJpeg = claimedMime.includes("jpeg") && sig.mime.includes("jpeg");
            const bothTiff = claimedMime.includes("tiff") && sig.mime.includes("tiff");
            if (!bothJpeg && !bothTiff) {
                issues.push(`MIME type mismatch: browser reports "${claimedMime}" but magic bytes indicate "${sig.mime}".`);
            }
        }

        if (sig.mime === "image/heic") notes.push("HEIC files are not displayable in all browsers but EXIF can still be read.");
        if (sig.mime === "image/avif") notes.push("AVIF support varies by browser.");
    }

    if (headerBytes.length < 12) {
        issues.push("File is extremely small and may be empty or truncated.");
    }

    return { ok: issues.length === 0, detectedMime, detectedExt, claimedMime, claimedExt, issues, notes };
}

export function tryDecodeRawValue(key: string, val: unknown): string | null {
    // Uint8Array or regular number array that looks like bytes
    const bytes: number[] | null =
        val instanceof Uint8Array
            ? Array.from(val)
            : Array.isArray(val) && val.length > 0 && typeof val[0] === "number" && val[0] <= 255
                ? (val as number[])
                : null;

    if (bytes) {
        // Attempt 1 — treat as UTF-8 text (printable ASCII / UTF-8 heuristic)
        const asText = bytes
            .map((b) => (b >= 0x20 && b < 0x7f) || b >= 0x80 ? String.fromCharCode(b) : null)
            .join("");
        const printableRatio = asText.replace(/[^ -~]/g, "").length / (bytes.length || 1);
        if (printableRatio > 0.85) {
            // Looks like text — try to decode as UTF-8 properly
            try {
                const decoded = new TextDecoder("utf-8").decode(new Uint8Array(bytes));
                const trimmed = decoded.replace(/\x00+$/, "").trim();
                if (trimmed.length > 0) return trimmed;
            } catch { /* fall through */ }
        }

        // Attempt 2 — "Raw profile type exif" PNG chunk: text block containing
        // "\nexif\n<length>\n<hex pairs>" — decode the embedded EXIF hex data
        // into a readable summary of byte count + first bytes
        const rawText = bytes.map((b) => String.fromCharCode(b)).join("");
        const profileMatch = rawText.match(/^(\w[\w ]*?)\n\s*(\d+)\n([0-9a-fA-F\s]+)/);
        if (profileMatch) {
            const profileType = profileMatch[1].trim();
            const byteCount = parseInt(profileMatch[2], 10);
            const hexStr = profileMatch[3].replace(/\s/g, "");
            // For exif profiles: first 6 bytes are "Exif\0\0"
            const firstBytes = hexStr.slice(0, 24).replace(/(.{2})/g, "$1 ").trim().toUpperCase();
            return `${profileType} profile · ${byteCount} bytes · [${firstBytes}...]`;
        }

        // Attempt 3 — XMP / XML embedded in bytes
        const xmlCandidate = new TextDecoder("utf-8", { fatal: false }).decode(new Uint8Array(bytes));
        if (xmlCandidate.includes("<?xpacket") || xmlCandidate.includes("<x:xmpmeta")) {
            // Extract dc:title or xmp:Label or just confirm it's XMP
            const titleMatch = xmlCandidate.match(/<dc:title[^>]*>[\s\S]*?<rdf:li[^>]*>([^<]+)<\/rdf:li>/);
            if (titleMatch) return `XMP: ${titleMatch[1].trim()}`;
            return "XMP metadata block";
        }

        // Attempt 4 — ICC profile (starts with 0x00000000 + "acsp" or similar)
        if (bytes.length > 4) {
            const tag = String.fromCharCode(bytes[36] ?? 0, bytes[37] ?? 0, bytes[38] ?? 0, bytes[39] ?? 0);
            if (tag === "acsp") return `ICC color profile · ${bytes.length} bytes`;
        }

        // Attempt 5 — fallback: show byte count + hex preview
        const preview = bytes.slice(0, 16).map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
        return `${bytes.length} bytes · [${preview}${bytes.length > 16 ? " ..." : ""}]`;
    }

    // String value that looks like raw hex dump (e.g. "0a 1b 2c ..." or "0A1B2C...")
    if (typeof val === "string") {
        const stripped = val.replace(/\s/g, "");
        if (/^[0-9a-fA-F]{8,}$/.test(stripped) && stripped.length % 2 === 0) {
            // Try to decode as UTF-8 text
            const hexBytes = stripped.match(/.{2}/g)!.map((h) => parseInt(h, 16));
            try {
                const decoded = new TextDecoder("utf-8").decode(new Uint8Array(hexBytes));
                const trimmed = decoded.replace(/\x00/g, "").trim();
                if (trimmed.length > 0 && /[\x20-\x7e]{4,}/.test(trimmed)) return trimmed;
            } catch { /* fall through */ }
            return `${hexBytes.length} bytes · [${stripped.slice(0, 32).replace(/.{2}/g, "$& ").trim().toUpperCase()}${stripped.length > 32 ? " ..." : ""}]`;
        }

        // base64 blobs
        if (/^[A-Za-z0-9+/]{16,}={0,2}$/.test(val) && val.length % 4 === 0) {
            try {
                const bin = atob(val);
                const bytes2 = Array.from(bin).map((c) => c.charCodeAt(0));
                const decoded = new TextDecoder("utf-8", { fatal: false }).decode(new Uint8Array(bytes2));
                const printable = decoded.replace(/[^\x20-\x7e\n\r\t]/g, "");
                if (printable.length / val.length > 0.5) return printable.trim();
            } catch { /* fall through */ }
            return `base64 blob · ${val.length} chars`;
        }
    }

    return null;
}