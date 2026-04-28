import type { PublicDashboardContext } from "../../types/publicTypes.ts";

import {
    PublicInput,
    PublicLabel,
} from "../base/index.ts";

type SubmissionFormFieldsProps = {
    dashboard: PublicDashboardContext;
};

export function SubmissionFormFields({
                                         dashboard,
                                     }: SubmissionFormFieldsProps) {
    return (
        <>
            <div className="space-y-2">
                <PublicLabel htmlFor="submissionIdentifier">
                    ID príspevku *
                </PublicLabel>

                <PublicInput
                    id="submissionIdentifier"
                    value={dashboard.submission.submissionIdentifier}
                    onChange={(event) =>
                        dashboard.setSubmission({
                            ...dashboard.submission,
                            submissionIdentifier: event.target.value,
                        })
                    }
                    placeholder="ID vášho príspevku"
                    aria-invalid={Boolean(
                        dashboard.submissionFieldErrors.submissionIdentifier
                    )}
                />

                {dashboard.submissionFieldErrors.submissionIdentifier ? (
                    <p className="text-sm text-red-600">
                        {dashboard.submissionFieldErrors.submissionIdentifier}
                    </p>
                ) : null}
            </div>

            <div className="space-y-2">
                <PublicLabel htmlFor="title">
                    Názov príspevku *
                </PublicLabel>

                <PublicInput
                    id="title"
                    value={dashboard.submission.title}
                    onChange={(event) =>
                        dashboard.setSubmission({
                            ...dashboard.submission,
                            title: event.target.value,
                        })
                    }
                    placeholder="Názov vášho príspevku"
                    aria-invalid={Boolean(dashboard.submissionFieldErrors.title)}
                />

                {dashboard.submissionFieldErrors.title ? (
                    <p className="text-sm text-red-600">
                        {dashboard.submissionFieldErrors.title}
                    </p>
                ) : null}
            </div>
        </>
    );
}