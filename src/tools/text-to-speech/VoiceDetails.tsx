import { Emoji } from "@/components/ui";
import { GradeBadge } from "./GradeBadge";
import type { VoiceInfo } from "./types";

export interface VoiceDetailsProps {
    voice: VoiceInfo;
}

export function VoiceDetails({ voice }: VoiceDetailsProps) {
    return (
        <div
            className="rounded-lg border border-(--border-default) bg-(--surface-secondary) px-3 py-2.5 text-sm"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-(--text-primary) font-medium leading-tight">
                        {voice.label}
                        {voice.traits ? <Emoji className="ml-1.5">{voice.traits}</Emoji> : null}
                    </p>
                    <p className="text-(--text-tertiary) text-xs mt-0.5">
                        {voice.accent} English · {voice.gender}
                    </p>
                </div>
                <GradeBadge grade={voice.grade} className="shrink-0 mt-0.5" />
            </div>
            <p className="text-(--text-secondary) text-xs mt-2 leading-relaxed">{voice.description}</p>
        </div>
    );
}