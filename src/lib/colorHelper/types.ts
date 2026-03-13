export type GradientType = "linear" | "radial" | "conic";

export interface ColorStop {
    id: number;
    color: string;
    position: number; // 0-100
}