import type { VoiceGrade } from "./types";

/** Format seconds as M:SS */
export function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

/** Derive grade colour token from a grade string. */
export function gradeColor(grade: VoiceGrade): string {
    if (grade.startsWith("A")) return "var(--color-success-500)";
    if (grade.startsWith("B")) return "var(--color-success-600)";
    if (grade.startsWith("C")) return "var(--color-warning-500)";
    return "var(--color-danger-500)";
}
