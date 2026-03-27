import { Emoji } from "@/components/ui";
import { GradeBadge } from "./GradeBadge";
import type { VoiceInfo } from "./types";

export interface VoiceOptionProps {
    voice: VoiceInfo;
}

export function VoiceOption({ voice }: VoiceOptionProps) {
    return (
        <span className="flex items-center gap-3">
            <span className="w-3 flex justify-start">
                <GradeBadge grade={voice.grade} />
            </span>

            <span className="flex items-center min-w-0">
                <span className="truncate">
                    {voice.label}
                </span>

                {voice.traits ? (
                    <Emoji className="ml-2 shrink-0">
                        {voice.traits}
                    </Emoji>
                ) : null}
            </span>
        </span>
    );
}