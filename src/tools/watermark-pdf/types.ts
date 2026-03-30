export interface TextWatermarkOpts {
    mode: "text";
    text: string;
    fontSize: number;
    opacity: number;
    rotation: number;
}

export interface ImageWatermarkOpts {
    mode: "image";
    src: string; // object URL or data URL
    scale: number; // 0–1, fraction of page width
    opacity: number;
    rotation: number;
}
export type WatermarkOpts = TextWatermarkOpts | ImageWatermarkOpts;

export type WatermarkMode = "text" | "image";