export const ROMAN_VALUES = [
    { value: 1000, numeral: "M" },
    { value: 900, numeral: "CM" },
    { value: 500, numeral: "D" },
    { value: 400, numeral: "CD" },
    { value: 100, numeral: "C" },
    { value: 90, numeral: "XC" },
    { value: 50, numeral: "L" },
    { value: 40, numeral: "XL" },
    { value: 10, numeral: "X" },
    { value: 9, numeral: "IX" },
    { value: 5, numeral: "V" },
    { value: 4, numeral: "IV" },
    { value: 1, numeral: "I" },
];

export function toRoman(n: number): string {
    if (n < 1 || n > 3999) return "Out of range (1-3999)";
    let result = "";
    for (const { value, numeral } of ROMAN_VALUES) {
        while (n >= value) { result += numeral; n -= value; }
    }
    return result;
}

export function fromRoman(s: string): number | null {
    const upper = s.toUpperCase().trim();
    if (!/^[IVXLCDM]+$/.test(upper)) return null;
    const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let result = 0;
    for (let i = 0; i < upper.length; i++) {
        const cur = map[upper[i]];
        const next = map[upper[i + 1]] ?? 0;
        if (cur < next) result -= cur;
        else result += cur;
    }
    return result;
}