import { AlertCircle } from "lucide-react";

import type { PublicDashboardContext } from "../../types/publicTypes.ts";

import {
    PublicAlert,
    PublicCard,
} from "../base/index.ts";

import { PresentationStatusSection } from "./PresentationStatusSection.tsx";
import { SubmissionFormFields } from "./SubmissionFormFields.tsx";
import { SubmissionMessages } from "./SubmissionMessages.tsx";
import { SubmissionSaveButton } from "./SubmissionSaveButton.tsx";

type SubmissionTabProps = {
    dashboard: PublicDashboardContext;
};

export function SubmissionTab({ dashboard }: SubmissionTabProps) {
    return (
        <PublicCard
            title="Odoslanie príspevku"
            description={
                dashboard.selectedConferenceEntryId
                    ? "Vyplňte informácie o vašom príspevku"
                    : "Dostupné po výbere conference entry"
            }
        >
            {dashboard.selectedConferenceEntryId ? (
                <div className="space-y-4">
                    {dashboard.submissionLoading ? (
                        <p className="text-sm text-gray-600">
                            Načítavam príspevok...
                        </p>
                    ) : null}

                    <SubmissionFormFields dashboard={dashboard} />

                    <PresentationStatusSection dashboard={dashboard} />

                    <SubmissionMessages dashboard={dashboard} />

                    <SubmissionSaveButton dashboard={dashboard} />
                </div>
            ) : (
                <PublicAlert icon={AlertCircle}>
                    Pre odoslanie príspevku musíte vybrať typ účasti.
                </PublicAlert>
            )}
        </PublicCard>
    );
}