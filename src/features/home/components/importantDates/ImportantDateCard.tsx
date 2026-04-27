import type { HomeImportantDate } from "../../types/homeTypes.ts";

import { getDateCardClassName } from "../../utils/homeUtils.ts";

import { ImportantDateStatusBadge } from "./ImportantDateStatusBadge.tsx";
import { ImportantDateValue } from "./ImportantDateValue.tsx";

type ImportantDateCardProps = {
    importantDate: HomeImportantDate;
};

export function ImportantDateCard({
                                      importantDate,
                                  }: ImportantDateCardProps) {
    return (
        <article
            className={[
                "rounded-xl border px-4 py-3",
                "transition-colors",
                getDateCardClassName(importantDate),
            ].join(" ")}
        >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                    <ImportantDateValue importantDate={importantDate} />

                    <p className="min-w-0 text-sm font-medium text-white/90">
                        {importantDate.label || "Názov termínu"}
                    </p>
                </div>

                <ImportantDateStatusBadge importantDate={importantDate} />
            </div>
        </article>
    );
}