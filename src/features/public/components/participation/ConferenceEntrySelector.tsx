import { AlertCircle } from "lucide-react";

import type { PublicDashboardContext } from "../../types/publicTypes.ts";

import {
    PublicAlert,
    PublicBadge,
    PublicOptionCard,
} from "../base/index.ts";

type ConferenceEntrySelectorProps = {
    dashboard: PublicDashboardContext;
};

export function ConferenceEntrySelector({
                                            dashboard,
                                        }: ConferenceEntrySelectorProps) {
    const locked = dashboard.invoiceGenerated;

    if (dashboard.conferenceEntryOptions.length === 0) {
        return (
            <PublicAlert icon={AlertCircle}>
                Pre aktívnu konferenciu zatiaľ nie sú nastavené žiadne
                conference entry možnosti.
            </PublicAlert>
        );
    }

    return (
        <div className="space-y-3">
            {dashboard.conferenceEntryOptions.map((conferenceEntry) => {
                const id = `conference-entry-${conferenceEntry.id}`;
                const selected =
                    dashboard.selectedConferenceEntryId ===
                    String(conferenceEntry.id);

                return (
                    <PublicOptionCard
                        key={conferenceEntry.id}
                        htmlFor={id}
                        selected={selected}
                        disabled={locked}
                    >
                        <input
                            id={id}
                            type="radio"
                            name="conferenceEntry"
                            value={conferenceEntry.id}
                            checked={selected}
                            disabled={locked}
                            onChange={(event) =>
                                dashboard.setSelectedConferenceEntryId(
                                    event.target.value
                                )
                            }
                            className="mt-1 h-5 w-5"
                        />

                        <div className="flex-1">
                            <div className="font-semibold text-gray-900">
                                {conferenceEntry.name}
                            </div>
                        </div>

                        <PublicBadge>
                            {conferenceEntry.price} €
                        </PublicBadge>
                    </PublicOptionCard>
                );
            })}
        </div>
    );
}