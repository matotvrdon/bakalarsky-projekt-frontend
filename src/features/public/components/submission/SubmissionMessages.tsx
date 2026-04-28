import { AlertCircle, CheckCircle2 } from "lucide-react";

import type { PublicDashboardContext } from "../../types/publicTypes.ts";

import { PublicAlert } from "../base/index.ts";

type SubmissionMessagesProps = {
    dashboard: PublicDashboardContext;
};

export function SubmissionMessages({ dashboard }: SubmissionMessagesProps) {
    return (
        <>
            {dashboard.submissionSuccessMessage ? (
                <PublicAlert variant="success" icon={CheckCircle2}>
                    {dashboard.submissionSuccessMessage}
                </PublicAlert>
            ) : null}

            {dashboard.saveSubmissionError ? (
                <PublicAlert variant="danger" icon={AlertCircle}>
                    {dashboard.saveSubmissionError}
                </PublicAlert>
            ) : null}
        </>
    );
}