import type { IntegrityResult } from "@/lib/imageHelper";
import { Badge } from "@/components/ui";
import { Check, TriangleAlert, Info } from "lucide-react";

export function IntegrityBadge({ result }: { result: IntegrityResult }) {
    if (result.ok && result.notes.length === 0) {
        return (
            <Badge
                variant="success"
                icon={Check}
                text="File OK"
            />
        );
    }
    if (result.issues.length > 0) {
        return (
            <Badge
                variant="danger"
                icon={TriangleAlert}
                text="Integrity issue"
            />
        );
    }
    return (
        <Badge
            variant="warning"
            icon={Info}
            text="Note"
        />
    );
}