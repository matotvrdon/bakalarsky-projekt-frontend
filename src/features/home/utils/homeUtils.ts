import type { HomeImportantDate } from "../types/homeTypes.ts";

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

export const formatConferenceRange = (
    startDate?: string | null,
    endDate?: string | null
) => {
    if (!startDate || !endDate) {
        return "";
    }

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

export const isDateUpdated = (importantDate: HomeImportantDate) =>
    Boolean(
        importantDate.updatedDate &&
        importantDate.updatedDate !== importantDate.normalDate
    );

const normalizeImportantDateStatus = (
    status: HomeImportantDate["importantDatesStatus"] | number | string | null | undefined
) => {
    if (status === "Extended" || status === 1 || status === "1") {
        return "Extended";
    }

    if (status === "Shortened" || status === 2 || status === "2") {
        return "Shortened";
    }

    return "Normal";
};

export const getDateStatusLabel = (importantDate: HomeImportantDate) => {
    const status = normalizeImportantDateStatus(
        importantDate.importantDatesStatus
    );

    if (status === "Extended") {
        return "Predĺžené";
    }

    if (status === "Shortened") {
        return "Skrátené";
    }

    return null;
};

export const getDateStatusClassName = (importantDate: HomeImportantDate) => {
    const status = normalizeImportantDateStatus(
        importantDate.importantDatesStatus
    );

    if (status === "Extended") {
        return "bg-emerald-100 text-emerald-800";
    }

    if (status === "Shortened") {
        return "bg-amber-100 text-amber-800";
    }

    return "bg-white/10 text-white";
};

export const getDateCardClassName = (importantDate: HomeImportantDate) => {
    const status = normalizeImportantDateStatus(
        importantDate.importantDatesStatus
    );

    if (status === "Extended") {
        return "border-emerald-300/25 bg-emerald-400/10 hover:bg-emerald-400/15";
    }

    if (status === "Shortened") {
        return "border-amber-300/25 bg-amber-400/10 hover:bg-amber-400/15";
    }

    return "border-white/15 bg-white/10 hover:bg-white/[0.13]";
};