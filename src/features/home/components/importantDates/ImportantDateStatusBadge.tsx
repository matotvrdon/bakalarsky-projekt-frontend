import type { HomeImportantDate } from "../../types/homeTypes.ts";

import {
    getDateStatusClassName,
    getDateStatusLabel,
} from "../../utils/homeUtils.ts";

type ImportantDateStatusBadgeProps = {
    importantDate: HomeImportantDate;
};

export function ImportantDateStatusBadge({
                                             importantDate,
                                         }: ImportantDateStatusBadgeProps) {
    const statusLabel = getDateStatusLabel(importantDate);

    if (!statusLabel) {
        return null;
    }

    return (
        <span
            className={[
                "inline-flex w-fit rounded-md px-2 py-0.5",
                "text-xs font-medium",
                getDateStatusClassName(importantDate),
            ].join(" ")}
        >
            {statusLabel}
        </span>
    );
}