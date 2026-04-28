import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
    getParticipantByUserId,
    type ParticipantPayload,
} from "../../../api/participantApi.ts";

import { uploadParticipantFile } from "../../../api/fileManagerApi.ts";

import {
    createSubmission,
    getSubmissionByParticipant,
    SubmissionApiError,
    updateSubmission,
    type SubmissionPayload,
} from "../../../api/submissionApi.ts";

import {
    APPROVED_STATUS,
    REJECTED_STATUS,
    SUBMISSION_FILE_TYPE,
    WAITING_FOR_APPROVAL_STATUS,
} from "../constants/publicConstants.ts";

import type {
    CurrentUser,
    SubmissionFieldErrors,
    SubmissionForm,
} from "../types/publicTypes.ts";

import {
    getLatestFileByType,
    normalizeFileStatus,
} from "../utils/publicUtils.ts";

type UseParticipantSubmissionInput = {
    currentUser: CurrentUser | null;
    participantDraft: ParticipantPayload | null;
    applyParticipantState: (participant: ParticipantPayload) => void;
};

const emptySubmission: SubmissionForm = {
    submissionIdentifier: "",
    title: "",
};

export function useParticipantSubmission({
                                             currentUser,
                                             participantDraft,
                                             applyParticipantState,
                                         }: UseParticipantSubmissionInput) {
    const [willPresent, setWillPresentState] = useState(false);
    const [presentationFile, setPresentationFile] = useState<File | null>(null);

    const [submissionRecord, setSubmissionRecord] =
        useState<SubmissionPayload | null>(null);

    const [submissionLoading, setSubmissionLoading] = useState(false);
    const [savingSubmission, setSavingSubmission] = useState(false);
    const [uploadingPresentation, setUploadingPresentation] = useState(false);

    const [saveSubmissionError, setSaveSubmissionError] = useState("");
    const [submissionFieldErrors, setSubmissionFieldErrors] =
        useState<SubmissionFieldErrors>({});

    const [submissionSuccessMessage, setSubmissionSuccessMessage] = useState("");
    const [submission, setSubmission] = useState<SubmissionForm>(emptySubmission);

    const latestSubmissionFile = getLatestFileByType(
        participantDraft?.fileManagers,
        SUBMISSION_FILE_TYPE
    );

    const latestSubmissionFileStatus = latestSubmissionFile
        ? normalizeFileStatus(latestSubmissionFile.fileStatus)
        : null;

    const latestSubmissionFileName = latestSubmissionFile
        ? latestSubmissionFile.originalFileName || latestSubmissionFile.fileName
        : "";

    const isSubmissionStatusLocked = Boolean(
        latestSubmissionFile && latestSubmissionFileStatus !== REJECTED_STATUS
    );

    const applySubmissionState = (nextSubmission: SubmissionPayload | null) => {
        setSubmissionRecord(nextSubmission);

        setSubmission({
            submissionIdentifier: nextSubmission?.submissionIdentifier ?? "",
            title: nextSubmission?.title ?? "",
        });

        setWillPresentState(nextSubmission?.isPresenting ?? false);
    };

    useEffect(() => {
        if (!participantDraft?.id) {
            return;
        }

        let cancelled = false;

        const loadSubmission = async () => {
            setSubmissionLoading(true);
            setSaveSubmissionError("");
            setSubmissionFieldErrors({});

            try {
                const loadedSubmission =
                    await getSubmissionByParticipant(participantDraft.id);

                if (cancelled) {
                    return;
                }

                applySubmissionState(loadedSubmission);
            } catch (error) {
                if (cancelled) {
                    return;
                }

                if (
                    error instanceof SubmissionApiError &&
                    error.code === "SUBMISSION_NOT_FOUND"
                ) {
                    applySubmissionState(null);
                    return;
                }

                setSaveSubmissionError(
                    error instanceof Error
                        ? error.message
                        : "Načítanie príspevku zlyhalo"
                );
            } finally {
                if (!cancelled) {
                    setSubmissionLoading(false);
                }
            }
        };

        loadSubmission();

        return () => {
            cancelled = true;
        };
    }, [participantDraft?.id]);

    const submissionStatusLabel = (() => {
        if (!submissionRecord && !latestSubmissionFile) {
            return "Nie";
        }

        if (!latestSubmissionFile) {
            return "Vytvorený";
        }

        if (latestSubmissionFileStatus === WAITING_FOR_APPROVAL_STATUS) {
            return "Čaká na schválenie";
        }

        if (latestSubmissionFileStatus === APPROVED_STATUS) {
            return "Schválené";
        }

        if (latestSubmissionFileStatus === REJECTED_STATUS) {
            return "Zamietnutý";
        }

        return "Vytvorený";
    })();

    const applySubmissionApiError = (error: unknown) => {
        const nextErrors: SubmissionFieldErrors = {};

        if (error instanceof SubmissionApiError) {
            if (error.validationErrors) {
                Object.entries(error.validationErrors).forEach(([field, messages]) => {
                    const normalizedField =
                        (field.charAt(0).toLowerCase() +
                            field.slice(1)) as keyof SubmissionFieldErrors;

                    if (
                        [
                            "submissionIdentifier",
                            "title",
                            "participantId",
                            "conferenceId",
                        ].includes(normalizedField)
                    ) {
                        nextErrors[normalizedField] = messages[0];
                    }
                });
            }

            if (error.field) {
                const normalizedField =
                    (error.field.charAt(0).toLowerCase() +
                        error.field.slice(1)) as keyof SubmissionFieldErrors;

                if (
                    [
                        "submissionIdentifier",
                        "title",
                        "participantId",
                        "conferenceId",
                    ].includes(normalizedField)
                ) {
                    nextErrors[normalizedField] = error.message;
                }
            }

            setSubmissionFieldErrors(nextErrors);

            if (Object.keys(nextErrors).length === 0) {
                setSaveSubmissionError(error.message);
            }

            return;
        }

        setSubmissionFieldErrors({});
        setSaveSubmissionError(
            error instanceof Error
                ? error.message
                : "Operácia s príspevkom zlyhala"
        );
    };

    const handleSaveSubmission = async () => {
        if (!participantDraft?.id) {
            setSaveSubmissionError("Participant nebol načítaný.");
            return;
        }

        if (!participantDraft.conferenceId) {
            setSubmissionFieldErrors({
                conferenceId: "Konferencia nebola načítaná.",
            });
            setSaveSubmissionError("Konferencia nebola načítaná.");
            return;
        }

        const nextErrors: SubmissionFieldErrors = {};

        if (!submission.submissionIdentifier.trim()) {
            nextErrors.submissionIdentifier = "ID príspevku je povinné.";
        }

        if (!submission.title.trim()) {
            nextErrors.title = "Názov príspevku je povinný.";
        }

        if (Object.keys(nextErrors).length > 0) {
            setSubmissionFieldErrors(nextErrors);
            setSaveSubmissionError("");
            return;
        }

        setSavingSubmission(true);
        setSaveSubmissionError("");
        setSubmissionSuccessMessage("");
        setSubmissionFieldErrors({});

        try {
            const payload = {
                participantId: participantDraft.id,
                conferenceId: participantDraft.conferenceId,
                submissionIdentifier: submission.submissionIdentifier.trim(),
                title: submission.title.trim(),
                isPresenting: willPresent,
            };

            const savedSubmission = submissionRecord?.id
                ? await updateSubmission(submissionRecord.id, payload)
                : await createSubmission(payload);

            applySubmissionState(savedSubmission);

            const message = submissionRecord?.id
                ? "Zmeny príspevku boli uložené."
                : "Príspevok bol vytvorený.";

            setSubmissionSuccessMessage(message);
            toast.success(message);
        } catch (error) {
            applySubmissionApiError(error);
        } finally {
            setSavingSubmission(false);
        }
    };

    const handleUploadSubmissionFile = async () => {
        if (!submissionRecord?.id) {
            setSaveSubmissionError("Najprv vytvorte alebo uložte príspevok.");
            return;
        }

        if (!participantDraft?.id || !currentUser?.id || !presentationFile) {
            setSaveSubmissionError("Vyberte súbor na odoslanie.");
            return;
        }

        setUploadingPresentation(true);
        setSaveSubmissionError("");

        try {
            await uploadParticipantFile(
                participantDraft.id,
                SUBMISSION_FILE_TYPE,
                presentationFile
            );

            const refreshedParticipant =
                await getParticipantByUserId(currentUser.id);

            applyParticipantState(refreshedParticipant);
            setPresentationFile(null);

            toast.success("Prezentácia bola odoslaná na overenie.");
        } catch (error) {
            setSaveSubmissionError(
                error instanceof Error
                    ? error.message
                    : "Odoslanie prezentácie zlyhalo"
            );
        } finally {
            setUploadingPresentation(false);
        }
    };

    const setWillPresent = (value: boolean) => {
        setWillPresentState(value);

        if (!value) {
            setPresentationFile(null);
        }
    };

    return {
        willPresent,
        presentationFile,
        submissionRecord,
        submission,
        submissionLoading,
        savingSubmission,
        uploadingPresentation,
        saveSubmissionError,
        submissionFieldErrors,
        submissionSuccessMessage,

        latestSubmissionFile,
        latestSubmissionFileName,
        latestSubmissionFileStatus,
        isSubmissionStatusLocked,

        submissionStatusLabel,

        setWillPresent,
        setPresentationFile,
        setSubmission,

        handleSaveSubmission,
        handleUploadSubmissionFile,
    };
}