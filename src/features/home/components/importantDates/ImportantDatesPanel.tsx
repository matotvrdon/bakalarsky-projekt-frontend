import type { HomeImportantDate } from "../../types/homeTypes.ts";

import { ImportantDateCard } from "./ImportantDateCard.tsx";

type ImportantDatesPanelProps = {
    importantDates: HomeImportantDate[];
};

export function ImportantDatesPanel({
                                        importantDates,
                                    }: ImportantDatesPanelProps) {
    return (
        <aside className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
            <div className="mb-5">
                <h2 className="text-2xl font-bold text-white">
                    Dôležité termíny
                </h2>

                <p className="mt-1 text-sm text-blue-100/75">
                    Aktuálne dátumy konferencie.
                </p>
            </div>

            {importantDates.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/20 px-4 py-8 text-center text-sm text-blue-100/75">
                    Termíny zatiaľ nie sú zadané.
                </div>
            ) : (
                <div className="space-y-3">
                    {importantDates.map((importantDate) => (
                        <ImportantDateCard
                            key={`${importantDate.id}-${importantDate.label}-${importantDate.normalDate}-${importantDate.updatedDate ?? "normal"}`}
                            importantDate={importantDate}
                        />
                    ))}
                </div>
            )}
        </aside>
    );
}