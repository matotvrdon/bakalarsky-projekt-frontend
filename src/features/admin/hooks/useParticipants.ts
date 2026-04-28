import { useEffect, useState } from "react";

import { getParticipantInvoices } from "../../../api/invoiceApi.ts";
import {
    getParticipantsByActiveConference,
    type FileManagerPayload,
    type FileStatusValue,
    type FileTypeValue,
} from "../../../api/participantApi.ts";

import type {
    AdminVerificationStatus,
    Participant,
    ParticipantInvoiceStatus,
} from "../types/adminTypes.ts";

const STUDENT_FILE_TYPE_VALUES: FileTypeValue[] = [
    0,
    "StudentVerification",
];

const SUBMISSION_FILE_TYPE_VALUES: FileTypeValue[] = [
    1,
    "Submission",
];

const normalizeFileStatus = (
    fileStatus?: FileStatusValue | null
): AdminVerificationStatus => {
    if (fileStatus === 0 || fileStatus === "WaitingForApproval") {
        return "waiting";
    }

    if (fileStatus === 1 || fileStatus === "Approved") {
        return "approved";
    }

    if (fileStatus === 2 || fileStatus === "Rejected") {
        return "rejected";
    }

    return "selected-no-file";
};

const findLatestFileByType = (
    fileManagers: FileManagerPayload[],
    fileTypes: FileTypeValue[]
) => {
    const files = fileManagers.filter((fileManager) =>
        fileTypes.includes(fileManager.fileType)
    );

    if (files.length === 0) {
        return null;
    }

    return [...files].sort((left, right) => {
        const leftTime = new Date(left.createdAt).getTime();
        const rightTime = new Date(right.createdAt).getTime();

        return rightTime - leftTime;
    })[0];
};

const getStudentStatus = (
    isStudent: boolean,
    latestStudentFile: FileManagerPayload | null
): AdminVerificationStatus => {
    if (!isStudent) {
        return "not-selected";
    }

    if (!latestStudentFile) {
        return "selected-no-file";
    }

    return normalizeFileStatus(latestStudentFile.fileStatus);
};

const getSubmissionStatus = (
    isPresenting: boolean,
    latestSubmissionFile: FileManagerPayload | null
): AdminVerificationStatus => {
    if (!isPresenting) {
        return "not-selected";
    }

    if (!latestSubmissionFile) {
        return "selected-no-file";
    }

    return normalizeFileStatus(latestSubmissionFile.fileStatus);
};

const getStudentStatusLabel = (status: AdminVerificationStatus) => {
    if (status === "not-selected") {
        return "Nie je študent";
    }

    if (status === "selected-no-file") {
        return "Vybral študentský status, neodoslal potvrdenie";
    }

    if (status === "waiting") {
        return "Čaká na potvrdenie";
    }

    if (status === "approved") {
        return "Schválené";
    }

    return "Zamietnuté";
};

const getSubmissionStatusLabel = (status: AdminVerificationStatus) => {
    if (status === "not-selected") {
        return "Bez príspevku";
    }

    if (status === "selected-no-file") {
        return "Vybral príspevok, neodoslal súbor";
    }

    if (status === "waiting") {
        return "Čaká na potvrdenie";
    }

    if (status === "approved") {
        return "Schválené";
    }

    return "Zamietnuté";
};

const getParticipationTypeLabel = (
    conferenceEntryName?: string | null,
    fallbackType?: string | null
) => {
    if (conferenceEntryName?.trim()) {
        return conferenceEntryName;
    }

    if (fallbackType?.trim()) {
        return fallbackType;
    }

    return "Nezadané";
};

const mapInvoiceStatus = (
    status?: number | null
): ParticipantInvoiceStatus => {
    if (status === 0) {
        return "pending";
    }

    if (status === 1) {
        return "paid";
    }

    if (status === 2) {
        return "cancelled";
    }

    return "none";
};

const getInvoiceStatusLabel = (status: ParticipantInvoiceStatus) => {
    if (status === "pending") {
        return "Čaká na úhradu";
    }

    if (status === "paid") {
        return "Zaplatená";
    }

    if (status === "cancelled") {
        return "Zrušená";
    }

    return "Bez faktúry";
};

const getRegistrationDate = (value?: string | null) => {
    if (!value) {
        return "-";
    }

    return value.split("T")[0] || "-";
};

export function useParticipants() {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [participantsLoading, setParticipantsLoading] = useState(false);
    const [participantsError, setParticipantsError] = useState("");

    useEffect(() => {
        loadParticipants();
    }, []);

    const loadParticipants = async (): Promise<Participant[]> => {
        try {
            setParticipantsLoading(true);
            setParticipantsError("");

            const data = await getParticipantsByActiveConference();

            const normalized = await Promise.all(
                Array.isArray(data)
                    ? data.map(async (participant) => {
                        let invoiceStatus: ParticipantInvoiceStatus = "none";
                        let invoiceNumber: string | null = null;

                        try {
                            const invoices = await getParticipantInvoices(
                                participant.id
                            );

                            const latestInvoice = invoices[0] ?? null;

                            if (latestInvoice) {
                                invoiceStatus = mapInvoiceStatus(
                                    latestInvoice.status
                                );

                                invoiceNumber = latestInvoice.invoiceNumber;
                            }
                        } catch (error) {
                            console.error(
                                `Failed to load invoices for participant ${participant.id}`,
                                error
                            );
                        }

                        const firstName = participant.firstName ?? "";
                        const lastName = participant.lastName ?? "";
                        const fullName = `${firstName} ${lastName}`.trim();

                        const fileManagers = participant.fileManagers ?? [];

                        const latestStudentFile = findLatestFileByType(
                            fileManagers,
                            STUDENT_FILE_TYPE_VALUES
                        );

                        const latestSubmissionFile = findLatestFileByType(
                            fileManagers,
                            SUBMISSION_FILE_TYPE_VALUES
                        );

                        const studentStatus = getStudentStatus(
                            participant.isStudent,
                            latestStudentFile
                        );

                        const submissionStatus = getSubmissionStatus(
                            participant.isPresenting ?? false,
                            latestSubmissionFile
                        );

                        const type = participant.isStudent
                            ? "student"
                            : "participant";

                        return {
                            id: participant.id,

                            firstName,
                            lastName,
                            fullName: fullName || "-",

                            conferenceEntryId:
                            participant.conferenceEntryId,
                            conferenceEntry:
                                participant.conferenceEntry ?? null,

                            isStudent: participant.isStudent,
                            isPresenting:
                                participant.isPresenting ?? false,

                            fileManagers,
                            latestStudentFile,
                            latestSubmissionFile,

                            email: participant.user?.email ?? "",
                            phone: participant.phone ?? "",
                            affiliation: participant.affiliation ?? "",
                            country: participant.country ?? "",

                            type,
                            participationTypeLabel:
                                getParticipationTypeLabel(
                                    participant.conferenceEntry?.name,
                                    type
                                ),

                            registrationDate: getRegistrationDate(
                                participant.createdAt
                            ),

                            studentStatus,
                            studentStatusLabel:
                                getStudentStatusLabel(studentStatus),

                            submissionStatus,
                            submissionStatusLabel:
                                getSubmissionStatusLabel(submissionStatus),

                            invoiceStatus,
                            invoiceStatusLabel:
                                getInvoiceStatusLabel(invoiceStatus),
                            invoiceNumber,
                        };
                    })
                    : []
            );

            setParticipants(normalized);
            return normalized;
        } catch (error) {
            console.error("Failed to load participants", error);
            setParticipants([]);
            setParticipantsError("Účastníkov sa nepodarilo načítať.");
            return [];
        } finally {
            setParticipantsLoading(false);
        }
    };

    return {
        participants,
        participantsLoading,
        participantsError,
        setParticipants,
        loadParticipants,
    };
}