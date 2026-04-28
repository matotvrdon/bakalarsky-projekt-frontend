import { AlertCircle } from "lucide-react";

import type { PublicDashboardContext } from "../../types/publicTypes.ts";

import {
    PublicAlert,
    PublicButton,
    PublicInput,
    PublicLabel,
} from "../base/index.ts";

type PresentationUploadBoxProps = {
    dashboard: PublicDashboardContext;
};

export function PresentationUploadBox({
                                          dashboard,
                                      }: PresentationUploadBoxProps) {
    if (!dashboard.willPresent || dashboard.isSubmissionStatusLocked) {
        return null;
    }

    return (
        <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
            <div className="space-y-1">
                <PublicLabel htmlFor="presentationUpload">
                    Prezentácia
                </PublicLabel>

                <p className="text-sm text-gray-500">
                    Nahrajte prezentáciu. Ak ju ešte nemáte pripravenú, môžete ju
                    doplniť neskôr.
                </p>
            </div>

            {!dashboard.submissionRecord?.id ? (
                <PublicAlert variant="info" icon={AlertCircle}>
                    Najprv vytvorte alebo uložte príspevok, potom môžete odoslať
                    prezentáciu.
                </PublicAlert>
            ) : null}

            <PublicInput
                id="presentationUpload"
                type="file"
                accept=".pdf,.ppt,.pptx"
                onChange={(event) =>
                    dashboard.setPresentationFile(event.target.files?.[0] ?? null)
                }
            />

            {dashboard.presentationFile ? (
                <p className="text-sm text-gray-600">
                    {dashboard.presentationFile.name}
                </p>
            ) : null}

            <PublicButton
                type="button"
                className="w-full sm:w-auto"
                onClick={dashboard.handleUploadSubmissionFile}
                disabled={
                    !dashboard.presentationFile ||
                    dashboard.uploadingPresentation ||
                    !dashboard.submissionRecord?.id
                }
            >
                {dashboard.uploadingPresentation
                    ? "Odosielam..."
                    : "Odoslať na overenie"}
            </PublicButton>
        </div>
    );
}