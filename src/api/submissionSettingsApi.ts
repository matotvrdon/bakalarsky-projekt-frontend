import { BASE_URL } from "./baseApi.ts";

export type SubmissionSettings = {
    id: number;
    conferenceSettingsId: number;

    ieeePdfExpressUrl?: string | null;
    easyChairUrl?: string | null;
    conferenceCode?: string | null;
    finalPaperDeadline?: string | null;

    ieeeTemplateUrl?: string | null;
    latexExample?: string | null;

    maxPages: number;
    extraPagePrice: number;
    abstractMinWords: number;

    isEnabled: boolean;
};

export type SubmissionSettingsUpdateRequest = {
    ieeePdfExpressUrl?: string | null;
    easyChairUrl?: string | null;
    conferenceCode?: string | null;
    finalPaperDeadline?: string | null;

    ieeeTemplateUrl?: string | null;
    latexExample?: string | null;

    maxPages: number;
    extraPagePrice: number;
    abstractMinWords: number;

    isEnabled: boolean;
};

const jsonHeaders = {
    "Content-Type": "application/json",
};

export const getActiveSubmissionSettings =
    async (): Promise<SubmissionSettings | null> => {
        const response = await fetch(`${BASE_URL}/api/submission-settings/active`);

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            throw new Error("Failed to load active submission settings.");
        }

        return response.json();
    };

export const getSubmissionSettingsByConference = async (
    conferenceId: number
): Promise<SubmissionSettings | null> => {
    const response = await fetch(
        `${BASE_URL}/api/submission-settings/conference/${conferenceId}`
    );

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Failed to load submission settings.");
    }

    return response.json();
};

export const updateSubmissionSettingsByConference = async (
    conferenceId: number,
    payload: SubmissionSettingsUpdateRequest
): Promise<SubmissionSettings> => {
    const response = await fetch(
        `${BASE_URL}/api/submission-settings/conference/${conferenceId}`,
        {
            method: "PUT",
            headers: jsonHeaders,
            body: JSON.stringify(payload),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update submission settings.");
    }

    return response.json();
};

export const deleteSubmissionSettingsByConference = async (
    conferenceId: number
): Promise<void> => {
    const response = await fetch(
        `${BASE_URL}/api/submission-settings/conference/${conferenceId}`,
        {
            method: "DELETE",
        }
    );

    if (!response.ok && response.status !== 404) {
        throw new Error("Failed to delete submission settings.");
    }
};