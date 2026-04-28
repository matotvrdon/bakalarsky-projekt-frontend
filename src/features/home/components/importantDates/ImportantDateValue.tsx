import type { HomeImportantDate } from "../../types/homeTypes.ts";

import {
    formatDate,
    isDateUpdated,
} from "../../utils/homeUtils.ts";

type ImportantDateValueProps = {
    importantDate: HomeImportantDate;
};

export function ImportantDateValue({
                                       importantDate,
                                   }: ImportantDateValueProps) {
    const updated = isDateUpdated(importantDate);
    const visibleDate = importantDate.updatedDate || importantDate.normalDate;

    return (
        <div className="shrink-0 sm:w-28">
            {updated && (
                <div className="text-xs text-white/45 line-through">
                    {formatDate(importantDate.normalDate)}
                </div>
            )}

            <div className="text-lg font-bold text-white">
                {formatDate(visibleDate)}
            </div>
        </div>
    );
}