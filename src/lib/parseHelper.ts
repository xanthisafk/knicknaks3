// CSV ///////////////////////////
export interface CsvParseOptions {
    header: boolean;
    dynamicTyping: boolean;
    skipEmptyLines: boolean;
    metadata: boolean;
    delimiter: string;
}

export const DEFAULT_CSV_PARSE_OPTIONS: CsvParseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    metadata: false,
    delimiter: ",",
};

export function flattenObject(obj: Record<string, unknown>, prefix = ""): Record<string, unknown> {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        const flatKey = prefix ? `${prefix}.${key}` : key;
        if (value !== null && typeof value === "object" && !Array.isArray(value)) {
            Object.assign(acc, flattenObject(value as Record<string, unknown>, flatKey));
        } else {
            acc[flatKey] = value;
        }
        return acc;
    }, {} as Record<string, unknown>);
}