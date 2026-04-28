import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
    getParticipantByUserId,
    updateParticipant,
    type ParticipantPayload,
} from "../../../api/participantApi.ts";

import {
    getActiveConferences,
    type Conference,
} from "../../../api/conferenceApi.ts";

import { uploadParticipantFile } from "../../../api/fileManagerApi.ts";

import {
    APPROVED_STATUS,
    REJECTED_STATUS,
    STUDENT_VERIFICATION_FILE_TYPE,
    WAITING_FOR_APPROVAL_STATUS,
} from "../constants/publicConstants.ts";

import type { CurrentUser } from "../types/publicTypes.ts";

import {
    getLatestFileByType,
    normalizeFileStatus,
} from "../utils/publicUtils.ts";

type UseParticipantProfileInput = {
    currentUser: CurrentUser | null;
    activeConference: Conference | null;
};

export function useParticipantProfile({
                                          currentUser,
                                          activeConference,
                                      }: UseParticipantProfileInput) {
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

    const conferenceEntryOptions =
        activeConference?.settings?.conferenceEntries ?? [];

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

    const applyParticipantState = (participant: ParticipantPayload) => {
        setParticipantDraft(participant);
        localStorage.setItem("participantDraft", JSON.stringify(participant));

        setSelectedConferenceEntryId(
            participant.conferenceEntryId
                ? String(participant.conferenceEntryId)
                : ""
        );

        setIsStudentState(participant.isStudent);
        setSavedConferenceEntryId(participant.conferenceEntryId);
        setSavedIsStudent(participant.isStudent);
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

    const conferenceEntryLabel = selectedConferenceEntry?.name || "Nezvolený";

    const hasParticipationChanges = Boolean(
        participantDraft &&
        (participantDraft.conferenceEntryId !== savedConferenceEntryId ||
            participantDraft.isStudent !== savedIsStudent)
    );

    const setIsStudent = (value: boolean) => {
        setIsStudentState(value);

        if (!value) {
            setStudentProofFile(null);
        }
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
        if (
            !participantDraft ||
            !participantDraft.id ||
            !currentUser?.id ||
            !studentProofFile
        ) {
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
                error instanceof Error
                    ? error.message
                    : "Odoslanie dokladu zlyhalo"
            );
        } finally {
            setUploadingStudentProof(false);
        }
    };

    return {
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

        conferenceEntryLabel,
        studentStatusLabel,

        setSelectedConferenceEntryId,
        setIsStudent,
        setStudentProofFile,

        applyParticipantState,
        updateDraft,
        handleSaveParticipation,
        handleUploadStudentProof,
    };
}