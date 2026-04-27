import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

import {
    APPROVED_STATUS,
    REJECTED_STATUS,
    WAITING_FOR_APPROVAL_STATUS,
} from "../../constants/publicConstants.ts";

import type { PublicDashboardContext } from "../../types/publicTypes.ts";

import { downloadBrowserFile } from "../../utils/publicUtils.ts";

import {
    PublicAlert,
    PublicButton,
    PublicCard,
    PublicInput,
    PublicLabel,
} from "../base/index.ts";

import { FileInfoCard } from "../FileInfoCard.tsx";

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
                            aria-invalid={Boolean(
                                dashboard.submissionFieldErrors.title
                            )}
                        />

                        {dashboard.submissionFieldErrors.title ? (
                            <p className="text-sm text-red-600">
                                {dashboard.submissionFieldErrors.title}
                            </p>
                        ) : null}
                    </div>

                    <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <label className="flex items-center gap-2">
                            <input
                                id="willPresent"
                                type="checkbox"
                                checked={dashboard.willPresent}
                                disabled={dashboard.isSubmissionStatusLocked}
                                onChange={(event) =>
                                    dashboard.setWillPresent(event.target.checked)
                                }
                                className="h-4 w-4"
                            />

                            <span className="text-sm font-medium text-gray-800">
                                Som prezentér
                            </span>
                        </label>

                        {dashboard.isSubmissionStatusLocked &&
                        dashboard.latestSubmissionFileStatus ===
                        WAITING_FOR_APPROVAL_STATUS ? (
                            <PublicAlert variant="warning" icon={Clock}>
                                Vaša prezentácia čaká na schválenie administrátorom.
                                Zmenu nie je možné vykonať.
                            </PublicAlert>
                        ) : null}

                        {dashboard.isSubmissionStatusLocked &&
                        dashboard.latestSubmissionFileStatus === APPROVED_STATUS ? (
                            <PublicAlert variant="success">
                                Prezentácia bola schválená.
                            </PublicAlert>
                        ) : null}

                        {dashboard.latestSubmissionFileStatus === REJECTED_STATUS ? (
                            <PublicAlert variant="danger">
                                Prezentácia bola zamietnutá. Nahrajte novú verziu.
                            </PublicAlert>
                        ) : null}

                        {dashboard.latestSubmissionFile ? (
                            <FileInfoCard
                                title="Aktuálna prezentácia"
                                fileName={dashboard.latestSubmissionFileName}
                                onOpen={() =>
                                    window.open(
                                        dashboard.getFileViewUrl(
                                            dashboard.latestSubmissionFile!.id
                                        ),
                                        "_blank",
                                        "noopener,noreferrer"
                                    )
                                }
                                onDownload={() =>
                                    downloadBrowserFile(
                                        dashboard.getFileDownloadUrl(
                                            dashboard.latestSubmissionFile!.id
                                        ),
                                        dashboard.latestSubmissionFileName
                                    )
                                }
                            />
                        ) : null}

                        {dashboard.willPresent &&
                        !dashboard.isSubmissionStatusLocked ? (
                            <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
                                <div className="space-y-1">
                                    <PublicLabel htmlFor="presentationUpload">
                                        Prezentácia
                                    </PublicLabel>

                                    <p className="text-sm text-gray-500">
                                        Nahrajte prezentáciu. Ak ju ešte nemáte
                                        pripravenú, môžete ju doplniť neskôr.
                                    </p>
                                </div>

                                {!dashboard.submissionRecord?.id ? (
                                    <PublicAlert variant="info" icon={AlertCircle}>
                                        Najprv vytvorte alebo uložte príspevok, potom
                                        môžete odoslať prezentáciu.
                                    </PublicAlert>
                                ) : null}

                                <PublicInput
                                    id="presentationUpload"
                                    type="file"
                                    accept=".pdf,.ppt,.pptx"
                                    onChange={(event) =>
                                        dashboard.setPresentationFile(
                                            event.target.files?.[0] ?? null
                                        )
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
                        ) : null}
                    </div>

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
                </div>
            ) : (
                <PublicAlert icon={AlertCircle}>
                    Pre odoslanie príspevku musíte vybrať typ účasti
                    "Účastník s príspevkom".
                </PublicAlert>
            )}
        </PublicCard>
    );
}