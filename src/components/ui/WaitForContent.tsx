import { Loader2 } from "lucide-react";
import { Label } from "./Label";

export interface WaitForContentProps {
    text?: string;
    size?: number;
}

export function WaitForContent({ text = "Loading...", size = 32 }: WaitForContentProps) {
    return (
        <div className="w-full h-full grid grid-cols-1 content-center justify-items-center gap-6">
            <Loader2 size={size} className="animate-spin text-primary-500" />
            <Label>{text}</Label>
        </div>
    )
}