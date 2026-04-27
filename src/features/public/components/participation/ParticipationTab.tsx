import type { PublicDashboardContext } from "../../types/publicTypes.ts";

import {
    PublicButton,
    PublicCard,
} from "../base/index.ts";

import { ConferenceEntrySelector } from "./ConferenceEntrySelector.tsx";
import { StudentStatusSection } from "./StudentStatusSection.tsx";

type ParticipationTabProps = {
    dashboard: PublicDashboardContext;
};

export function ParticipationTab({ dashboard }: ParticipationTabProps) {
    return (
        <PublicCard
            title="Conference entry"
            description="Vyberte si typ vstupu dostupný pre aktívnu konferenciu"
        >
            <div className="space-y-6">
                <ConferenceEntrySelector dashboard={dashboard} />

                {dashboard.selectedConferenceEntryId ? (
                    <>
                        <div className="border-t border-gray-200" />

                        <StudentStatusSection dashboard={dashboard} />

                        <div className="border-t border-gray-200" />

                        <PublicButton
                            type="button"
                            className="w-full"
                            onClick={dashboard.handleSaveParticipation}
                            disabled={
                                dashboard.savingParticipant ||
                                !dashboard.hasParticipationChanges
                            }
                        >
                            {dashboard.savingParticipant
                                ? "Ukladám..."
                                : "Uložiť"}
                        </PublicButton>
                    </>
                ) : null}
            </div>
        </PublicCard>
    );
}