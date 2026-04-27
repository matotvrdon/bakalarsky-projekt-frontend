import { BASE_URL } from "../../../app/api/baseApi.ts";

import {
    APPROVED_STATUS,
    REJECTED_STATUS,
    STUDENT_VERIFICATION_FILE_TYPE,
    SUBMISSION_FILE_TYPE,
    WAITING_FOR_APPROVAL_STATUS,
} from "../constants/publicConstants.ts";

import type { FoodOptionType } from "../../../app/api/conferenceApi.ts";
import type { FileManagerPayload } from "../../../app/api/participantApi.ts";

export const normalizeFileType = (value: number | string) => {
    if (typeof value === "number") {
        return value;
    }

    const normalized = value.toLowerCase();

    if (normalized === "studentverification") {
        return STUDENT_VERIFICATION_FILE_TYPE;
    }

    if (normalized === "submission") {
        return SUBMISSION_FILE_TYPE;
    }

    return null;
};

export const normalizeFileStatus = (value: number | string) => {
    if (typeof value === "number") {
        return value;
    }

    const normalized = value.toLowerCase();

    if (normalized === "waitingforapproval") {
        return WAITING_FOR_APPROVAL_STATUS;
    }

    if (normalized === "approved") {
        return APPROVED_STATUS;
    }

    if (normalized === "rejected") {
        return REJECTED_STATUS;
    }

    return null;
};

export const formatDate = (value?: string | null) => {
    if (!value) {
        return "";
    }

    const [year, month, day] = value.split("-");

    if (!year || !month || !day) {
        return value;
    }

    return `${day}.${month}.${year}`;
};

export const formatDateRange = (
    startDate?: string | null,
    endDate?: string | null
) => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);

    if (start && end) {
        return `${start} - ${end}`;
    }

    return start || end || "";
};

export const getFoodTypeLabel = (value: FoodOptionType) => {
    if (value === 0) {
        return "Raňajky";
    }

    if (value === 1) {
        return "Obed";
    }

    if (value === 2) {
        return "Večera";
    }

    return String(value);
};

export const getFileViewUrl = (fileManagerId: number) =>
    `${BASE_URL}/api/file-manager/view/${fileManagerId}`;

export const getFileDownloadUrl = (fileManagerId: number) =>
    `${BASE_URL}/api/file-manager/download/${fileManagerId}`;

export const sortFilesByCreatedAtDescending = (files: FileManagerPayload[]) =>
    [...files].sort(
        (left, right) =>
            new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    );

export const getLatestFileByType = (
    files: FileManagerPayload[] | undefined,
    fileType: number
) => {
    return sortFilesByCreatedAtDescending(files ?? []).filter(
        (file) => normalizeFileType(file.fileType) === fileType
    )[0] ?? null;
};

export const downloadBrowserFile = (url: string, fileName: string) => {
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    link.remove();
};

export const createSharedInvoiceCode = () =>
    `CONF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;