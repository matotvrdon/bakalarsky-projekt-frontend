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