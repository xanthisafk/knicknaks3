import { tryDecodeRawValue } from "./integrity";

export function formatValue(key: string, val: unknown): string {
    if (val == null) return "";

    if (val instanceof Date) return val.toLocaleString();

    const isByteArray =
        val instanceof Uint8Array ||
        (Array.isArray(val) &&
            val.length > 0 &&
            typeof val[0] === "number" &&
            val[0] <= 255);

    const asNumber = typeof val === "number" ? val : null;

    /* -----------------------------
       Special EXIF decoders
    ------------------------------*/

    if (key === "GPSProcessingMethod") {
        if (isByteArray) {
            const bytes = val instanceof Uint8Array ? val : new Uint8Array(val as number[]);
            const text = new TextDecoder().decode(bytes);
            return text.replace(/^ASCII\0*/i, "").replace(/\0/g, "").trim();
        }
        if (typeof val === "string") {
            return val.replace(/^ASCII\0*/i, "").replace(/\0/g, "").trim();
        }
    }

    if (key === "ComponentsConfiguration" && isByteArray) {
        const bytes = val instanceof Uint8Array ? val : new Uint8Array(val as number[]);
        const map: Record<number, string> = {
            1: "Y",
            2: "Cb",
            3: "Cr",
            4: "R",
            5: "G",
            6: "B",
        };
        return Array.from(bytes)
            .map((b) => map[b])
            .filter(Boolean)
            .join("");
    }

    if (key === "GPSAltitudeRef") {
        if (val instanceof Uint8Array || Array.isArray(val)) {
            const byte = val instanceof Uint8Array ? val[0] : val[0];
            return byte === 1 ? "Below sea level" : "Above sea level";
        }

        if (typeof val === "number") {
            return val === 1 ? "Below sea level" : "Above sea level";
        }
    }

    /* -----------------------------
       Try generic raw decode
    ------------------------------*/

    if (
        isByteArray &&
        !["GPSLatitude", "GPSLongitude", "LensInfo", "SubjectArea", "CFAPattern"].includes(key)
    ) {
        const decoded = tryDecodeRawValue(key, val);
        if (decoded) return decoded;
    }

    if (typeof val === "string" && val.length > 20) {
        const decoded = tryDecodeRawValue(key, val);
        if (decoded && decoded !== val) return decoded;
    }

    /* -----------------------------
       Numeric formatting
    ------------------------------*/

    if (asNumber !== null) {
        switch (key) {
            case "ExposureTime":
                return asNumber >= 1
                    ? `${asNumber.toFixed(1)}s`
                    : `1/${Math.round(1 / asNumber)}s`;

            case "FNumber":
                return `f/${asNumber.toFixed(1)}`;

            case "FocalLength":
            case "FocalLengthIn35mmFormat":
                return `${asNumber.toFixed(1)} mm`;

            case "ExposureBiasValue":
                return `${asNumber >= 0 ? "+" : ""}${asNumber.toFixed(2)} EV`;

            case "XResolution":
            case "YResolution":
                return `${Math.round(asNumber)} dpi`;

            case "DigitalZoomRatio":
                return asNumber === 0 || asNumber === 1
                    ? "None"
                    : `${asNumber.toFixed(2)}x`;

            case "GPSAltitude":
                return `${asNumber.toFixed(1)} m`;

            case "GPSSpeed":
                return `${asNumber.toFixed(1)} km/h`;

            case "FileSize":
                if (asNumber > 1_000_000)
                    return `${(asNumber / 1_000_000).toFixed(2)} MB`;
                if (asNumber > 1_000)
                    return `${(asNumber / 1_000).toFixed(1)} KB`;
                return `${asNumber} B`;

            case "GPSLatitude":
            case "GPSLongitude":
            case "latitude":
            case "longitude":
                return `${asNumber.toFixed(6)}°`;
        }
    }

    /* -----------------------------
       GPS DMS arrays
    ------------------------------*/

    if (
        (key === "GPSLatitude" || key === "GPSLongitude") &&
        Array.isArray(val)
    ) {
        const [d, m, s] = val as number[];
        return `${Math.floor(d)}° ${Math.floor(m)}' ${(s ?? 0).toFixed(2)}"`;
    }

    /* -----------------------------
       Arrays
    ------------------------------*/

    if (Array.isArray(val))
        return val.map((v) => formatValue("", v)).join(", ");

    /* -----------------------------
       Default numbers
    ------------------------------*/

    if (typeof val === "number")
        return Number.isInteger(val)
            ? String(val)
            : val.toFixed(4).replace(/\.?0+$/, "");

    return String(val);
}

export function buildFileFields(file: File, parsed: Record<string, unknown>): Record<string, unknown> {
    return {
        FileSize: file.size,
        FileType: file.name.split(".").pop()?.toUpperCase() ?? "Unknown",
        MIMEType: file.type || "unknown",
        ImageWidth: parsed.ImageWidth ?? parsed.ExifImageWidth ?? parsed.PixelXDimension ?? null,
        ImageHeight: parsed.ImageHeight ?? parsed.ExifImageHeight ?? parsed.PixelYDimension ?? null,
        BitDepth: parsed.BitDepth ?? null,
        ColorType: parsed.ColorType ?? null,
        Compression: parsed.Compression ?? null,
        Filter: parsed.Filter ?? null,
        Interlace: parsed.Interlace ?? null,
        PixelsPerUnitX: parsed.PixelsPerUnitX ?? null,
        PixelsPerUnitY: parsed.PixelsPerUnitY ?? null,
        PixelUnits: parsed.PixelUnits ?? null,
        ColorComponents: parsed.ColorComponents ?? null,
        BitsPerSample: parsed.BitsPerSample ?? null,
    };
}

export function extractGpsCoords(data: Record<string, unknown>): { lat: number; lon: number } | null {
    // exifr with translateValues:true provides top-level decimal `latitude` / `longitude`
    if (typeof data.latitude === "number" && typeof data.longitude === "number"
        && !isNaN(data.latitude) && !isNaN(data.longitude)) {
        return { lat: data.latitude, lon: data.longitude };
    }

    // Fallback: raw GPSLatitude / GPSLongitude (may be decimal or DMS array)
    const rawLat = data.GPSLatitude;
    const rawLon = data.GPSLongitude;
    const latRef = (data.GPSLatitudeRef as string) ?? "N";
    const lonRef = (data.GPSLongitudeRef as string) ?? "E";

    let latN: number | null = null;
    let lonN: number | null = null;

    if (typeof rawLat === "number") latN = rawLat;
    else if (Array.isArray(rawLat) && rawLat.length >= 2) {
        latN = (rawLat[0] as number) + (rawLat[1] as number) / 60 + ((rawLat[2] as number) ?? 0) / 3600;
    }

    if (typeof rawLon === "number") lonN = rawLon;
    else if (Array.isArray(rawLon) && rawLon.length >= 2) {
        lonN = (rawLon[0] as number) + (rawLon[1] as number) / 60 + ((rawLon[2] as number) ?? 0) / 3600;
    }

    if (latN !== null && lonN !== null && !isNaN(latN) && !isNaN(lonN)) {
        return {
            lat: latRef.toUpperCase() === "S" ? -Math.abs(latN) : Math.abs(latN),
            lon: lonRef.toUpperCase() === "W" ? -Math.abs(lonN) : Math.abs(lonN),
        };
    }

    return null;
}