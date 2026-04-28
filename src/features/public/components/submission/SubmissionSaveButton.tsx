import type { PublicDashboardContext } from "../../types/publicTypes.ts";

import { PublicButton } from "../base/index.ts";

type SubmissionSaveButtonProps = {
    dashboard: PublicDashboardContext;
};

export function SubmissionSaveButton({
                                         dashboard,
                                     }: SubmissionSaveButtonProps) {
    return (
        <PublicButton
            type="button"
            className="w-full"
            onClick={dashboard.handleSaveSubmission}
            disabled={
                dashboard.savingSubmission ||
                dashboard.submissionLoading
            }
        >
            {dashboard.savingSubmission
                ? "Ukladám..."
                : dashboard.submissionRecord?.id
                    ? "Uložiť zmeny"
                    : "Vytvoriť príspevok"}
        </PublicButton>
    );
}