import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import {
    getParticipantByUserId,
    updateParticipant,
    type ParticipantPayload,
} from "../../../app/api/participantApi.ts";

import { getActiveConferences } from "../../../app/api/conferenceApi.ts";
import { uploadParticipantFile } from "../../../app/api/fileManagerApi.ts";

import {
    createSubmission,
    getSubmissionByParticipant,
    SubmissionApiError,
    updateSubmission,
    type SubmissionPayload,
} from "../../../app/api/submissionApi.ts";

import {
    APPROVED_STATUS,
    REJECTED_STATUS,
    STUDENT_VERIFICATION_FILE_TYPE,
    SUBMISSION_FILE_TYPE,
    WAITING_FOR_APPROVAL_STATUS,
} from "../constants/publicConstants.ts";

import type {
    BillingInfo,
    CurrentUser,
    InvoiceStatus,
    InvoiceType,
    PublicDashboardContext,
    SubmissionFieldErrors,
    SubmissionForm,
} from "../types/publicTypes.ts";

import {
    createSharedInvoiceCode,
    getFileDownloadUrl,
    getFileViewUrl,
    getLatestFileByType,
    normalizeFileStatus,
} from "../utils/publicUtils.ts";

import { useActiveConference } from "./useActiveConference.ts";

const emptyBillingInfo: BillingInfo = {
    companyName: "",
    ico: "",
    dic: "",
    address: "",
};

const emptySubmission: SubmissionForm = {
    submissionIdentifier: "",
    title: "",
};

export function usePublicDashboard(): PublicDashboardContext {
    const navigate = useNavigate();
    const activeConference = useActiveConference();

    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

    const [participantDraft, setParticipantDraft] =
        useState<ParticipantPayload | null>(null);

    const [selectedConferenceEntryId, setSelectedConferenceEntryId] =
        useState("");

    const [savedConferenceEntryId, setSavedConferenceEntryId] =
        useState<ParticipantPayload["conferenceEntryId"]>(null);

    const [isStudent, setIsStudentState] = useState(false);
    const [savedIsStudent, setSavedIsStudent] = useState(false);
    const [studentProofFile, setStudentProofFile] = useState<File | null>(null);

    const [savingParticipant, setSavingParticipant] = useState(false);
    const [saveParticipantError, setSaveParticipantError] = useState("");
    const [uploadingStudentProof, setUploadingStudentProof] = useState(false);
    const [studentUploadError, setStudentUploadError] = useState("");

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

    const [accommodation, setAccommodation] = useState<number | null>(null);
    const [catering, setCatering] = useState<number[]>([]);

    const [invoiceGenerated, setInvoiceGenerated] = useState(false);
    const [invoiceStatus, setInvoiceStatus] =
        useState<InvoiceStatus>("pending");

    const [invoiceType, setInvoiceType] =
        useState<InvoiceType>("individual");

    const [sharedInvoiceCode, setSharedInvoiceCode] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [hasCustomBilling, setHasCustomBilling] = useState(false);
    const [billingInfo, setBillingInfo] = useState<BillingInfo>(emptyBillingInfo);

    const conferenceEntryOptions =
        activeConference?.settings?.conferenceEntries ?? [];

    const accommodationOptions =
        activeConference?.settings?.bookingOptions ?? [];

    const cateringOptions =
        activeConference?.settings?.foodOptions ?? [];

    const selectedConferenceEntry = useMemo(() => {
        return (
            conferenceEntryOptions.find(
                (conferenceEntry) =>
                    String(conferenceEntry.id) === selectedConferenceEntryId
            ) ??
            participantDraft?.conferenceEntry ??
            null
        );
    }, [
        conferenceEntryOptions,
        selectedConferenceEntryId,
        participantDraft?.conferenceEntry,
    ]);

    const selectedAccommodation =
        accommodationOptions.find((option) => option.id === accommodation) ?? null;

    const applyParticipantState = (participant: ParticipantPayload) => {
        setParticipantDraft(participant);
        localStorage.setItem("participantDraft", JSON.stringify(participant));

        setSelectedConferenceEntryId(
            participant.conferenceEntryId ? String(participant.conferenceEntryId) : ""
        );

        setIsStudentState(participant.isStudent);
        setSavedConferenceEntryId(participant.conferenceEntryId);
        setSavedIsStudent(participant.isStudent);
    };

    const applySubmissionState = (nextSubmission: SubmissionPayload | null) => {
        setSubmissionRecord(nextSubmission);

        setSubmission({
            submissionIdentifier: nextSubmission?.submissionIdentifier ?? "",
            title: nextSubmission?.title ?? "",
        });

        setWillPresentState(nextSubmission?.isPresenting ?? false);
    };

    const updateDraft = (updates: Partial<ParticipantPayload>) => {
        setParticipantDraft((currentDraft) => {
            if (!currentDraft) {
                return currentDraft;
            }

            const nextDraft = {
                ...currentDraft,
                ...updates,
            };

            localStorage.setItem("participantDraft", JSON.stringify(nextDraft));

            return nextDraft;
        });
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("currentUser");

        if (!storedUser) {
            navigate("/login");
            return;
        }

        const parsedUser = JSON.parse(storedUser) as CurrentUser;

        if (parsedUser.role !== "participant") {
            navigate("/admin");
            return;
        }

        setCurrentUser(parsedUser);
    }, [navigate]);

    useEffect(() => {
        if (!currentUser) {
            return;
        }

        const loadParticipant = async () => {
            try {
                const participant = await getParticipantByUserId(currentUser.id);
                applyParticipantState(participant);
            } catch {
                const stored = localStorage.getItem("participantDraft");

                if (stored) {
                    applyParticipantState(JSON.parse(stored) as ParticipantPayload);
                    return;
                }

                const nameParts = (currentUser.name || "").trim().split(" ");
                const firstName = nameParts[0] || "";
                const lastName = nameParts.slice(1).join(" ") || "";

                const draft: ParticipantPayload = {
                    id: currentUser.participantId ?? 0,
                    firstName,
                    lastName,
                    phone: null,
                    affiliation: null,
                    country: null,
                    conferenceEntryId: null,
                    conferenceEntry: null,
                    isStudent: false,
                    isPresenting: false,
                    fileManagers: [],
                    userId: currentUser.id ?? 0,
                    conferenceId: currentUser.conferenceId ?? 0,
                };

                applyParticipantState(draft);
            }
        };

        loadParticipant();
    }, [currentUser]);

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

    useEffect(() => {
        if (!participantDraft) {
            return;
        }

        updateDraft({
            conferenceEntryId: selectedConferenceEntryId
                ? Number(selectedConferenceEntryId)
                : null,
            conferenceEntry: selectedConferenceEntry,
            isStudent,
        });
    }, [selectedConferenceEntryId, selectedConferenceEntry, isStudent]);

    useEffect(() => {
        if (!activeConference) {
            return;
        }

        if (
            selectedConferenceEntryId &&
            !conferenceEntryOptions.some(
                (option) => String(option.id) === selectedConferenceEntryId
            )
        ) {
            setSelectedConferenceEntryId("");
        }
    }, [activeConference, selectedConferenceEntryId, conferenceEntryOptions]);

    useEffect(() => {
        if (
            accommodation &&
            !accommodationOptions.some((option) => option.id === accommodation)
        ) {
            setAccommodation(null);
        }
    }, [accommodation, accommodationOptions]);

    useEffect(() => {
        setCatering((currentSelections) =>
            currentSelections.filter((id) =>
                cateringOptions.some((option) => option.id === id)
            )
        );
    }, [cateringOptions]);

    const studentVerificationFile = getLatestFileByType(
        participantDraft?.fileManagers,
        STUDENT_VERIFICATION_FILE_TYPE
    );

    const studentVerificationStatus = studentVerificationFile
        ? normalizeFileStatus(studentVerificationFile.fileStatus)
        : null;

    const studentVerificationFileName = studentVerificationFile
        ? studentVerificationFile.originalFileName || studentVerificationFile.fileName
        : "";

    const isStudentStatusLocked = Boolean(
        participantDraft?.isStudent &&
        studentVerificationFile &&
        studentVerificationStatus !== REJECTED_STATUS
    );

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

    const conferenceEntryLabel = selectedConferenceEntry?.name || "Nezvolený";

    const studentStatusLabel = (() => {
        if (!savedIsStudent) {
            return "Nie";
        }

        if (!studentVerificationFile) {
            return "Zvolený, neposlaný";
        }

        if (studentVerificationStatus === WAITING_FOR_APPROVAL_STATUS) {
            return "Čaká na schválenie";
        }

        if (studentVerificationStatus === APPROVED_STATUS) {
            return "Áno";
        }

        if (studentVerificationStatus === REJECTED_STATUS) {
            return "Zamietnutý, pošlite iné potvrdenie";
        }

        return "Zvolený, neschválený";
    })();

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

    const hasParticipationChanges = Boolean(
        participantDraft &&
        (participantDraft.conferenceEntryId !== savedConferenceEntryId ||
            participantDraft.isStudent !== savedIsStudent)
    );

    const calculateTotal = () => {
        let total = 0;

        if (selectedConferenceEntry) {
            total += selectedConferenceEntry.price;
        }

        if (selectedAccommodation) {
            total += selectedAccommodation.price;
        }

        catering.forEach((id) => {
            const option = cateringOptions.find(
                (cateringOption) => cateringOption.id === id
            );

            if (option) {
                total += option.price;
            }
        });

        return total;
    };

    const applySubmissionApiError = (error: unknown) => {
        const nextErrors: SubmissionFieldErrors = {};

        if (error instanceof SubmissionApiError) {
            if (error.validationErrors) {
                Object.entries(error.validationErrors).forEach(([field, messages]) => {
                    const normalizedField =
                        (field.charAt(0).toLowerCase() + field.slice(1)) as keyof SubmissionFieldErrors;

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

    const handleSaveParticipation = async () => {
        if (!participantDraft) {
            return;
        }

        if (
            participantDraft.conferenceEntryId === null &&
            !participantDraft.isStudent
        ) {
            setSaveParticipantError("Vyberte typ účasti alebo študentský status.");
            return;
        }

        setSavingParticipant(true);
        setSaveParticipantError("");

        try {
            let payload = participantDraft;

            if (!payload.conferenceId || payload.conferenceId === 0) {
                const activeConferences = await getActiveConferences();
                const activeConferenceResult = activeConferences[0];

                if (!activeConferenceResult) {
                    throw new Error("Aktívna konferencia nebola nájdená.");
                }

                payload = {
                    ...payload,
                    conferenceId: activeConferenceResult.id,
                };

                updateDraft({
                    conferenceId: activeConferenceResult.id,
                });
            }

            await updateParticipant(payload);

            if (!currentUser) {
                return;
            }

            const refreshedParticipant =
                await getParticipantByUserId(currentUser.id);

            applyParticipantState(refreshedParticipant);

            toast.success("Zmeny sú uložené v databáze");
        } catch (error) {
            setSaveParticipantError(
                error instanceof Error ? error.message : "Uloženie zlyhalo"
            );
        } finally {
            setSavingParticipant(false);
        }
    };

    const handleUploadStudentProof = async () => {
        if (!participantDraft || !participantDraft.id || !currentUser?.id || !studentProofFile) {
            setStudentUploadError("Vyberte súbor na odoslanie.");
            return;
        }

        setUploadingStudentProof(true);
        setStudentUploadError("");

        try {
            let payload = participantDraft;

            if (!payload.conferenceId || payload.conferenceId === 0) {
                const activeConferences = await getActiveConferences();
                const activeConferenceResult = activeConferences[0];

                if (!activeConferenceResult) {
                    throw new Error("Aktívna konferencia nebola nájdená.");
                }

                payload = {
                    ...payload,
                    conferenceId: activeConferenceResult.id,
                    isStudent: true,
                };
            } else {
                payload = {
                    ...payload,
                    isStudent: true,
                };
            }

            const savedParticipant = await updateParticipant(payload);

            await uploadParticipantFile(
                savedParticipant.id,
                STUDENT_VERIFICATION_FILE_TYPE,
                studentProofFile
            );

            const refreshedParticipant =
                await getParticipantByUserId(currentUser.id);

            applyParticipantState(refreshedParticipant);
            setStudentProofFile(null);

            toast.success("Doklad bol odoslaný na overenie.");
        } catch (error) {
            setStudentUploadError(
                error instanceof Error ? error.message : "Odoslanie dokladu zlyhalo"
            );
        } finally {
            setUploadingStudentProof(false);
        }
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

    const handleGenerateInvoice = () => {
        setInvoiceGenerated(true);
        setInvoiceStatus("pending");

        if (invoiceType === "create-shared") {
            setSharedInvoiceCode(createSharedInvoiceCode());
        }
    };

    const handleDownloadInvoice = () => {
        alert("Faktúra sa sťahuje...");
    };

    const copySharedInvoiceCode = async () => {
        if (!sharedInvoiceCode) {
            return;
        }

        await navigator.clipboard.writeText(sharedInvoiceCode);
        toast.success("Kód bol skopírovaný.");
    };

    const setIsStudent = (value: boolean) => {
        setIsStudentState(value);

        if (!value) {
            setStudentProofFile(null);
        }
    };

    const setWillPresent = (value: boolean) => {
        setWillPresentState(value);

        if (!value) {
            setPresentationFile(null);
        }
    };

    return {
        currentUser,
        activeConference,

        participantDraft,
        selectedConferenceEntryId,
        selectedConferenceEntry,
        conferenceEntryOptions,

        isStudent,
        isStudentStatusLocked,
        studentProofFile,
        studentVerificationFile,
        studentVerificationFileName,
        studentVerificationStatus,
        savedIsStudent,
        savingParticipant,
        uploadingStudentProof,
        saveParticipantError,
        studentUploadError,
        hasParticipationChanges,

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

        accommodation,
        accommodationOptions,
        selectedAccommodation,
        catering,
        cateringOptions,

        invoiceGenerated,
        invoiceStatus,
        invoiceType,
        sharedInvoiceCode,
        joinCode,
        hasCustomBilling,
        billingInfo,

        summary: {
            conferenceEntryLabel,
            studentStatusLabel,
            submissionStatusLabel,
        },

        total: calculateTotal(),

        setSelectedConferenceEntryId,
        setIsStudent,
        setStudentProofFile,
        setWillPresent,
        setPresentationFile,
        setSubmission,
        setAccommodation,
        setCatering,
        setInvoiceType,
        setJoinCode,
        setHasCustomBilling,
        setBillingInfo,

        handleSaveParticipation,
        handleUploadStudentProof,
        handleSaveSubmission,
        handleUploadSubmissionFile,
        handleGenerateInvoice,
        handleDownloadInvoice,
        copySharedInvoiceCode,
        getFileViewUrl,
        getFileDownloadUrl,
    };
}