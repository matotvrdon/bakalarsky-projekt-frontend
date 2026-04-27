import type { ImportantDate } from "../../../app/api/conferenceApi.ts";

export type HomeImportantDate = Omit<ImportantDate, "importantDatesStatus"> & {
    importantDatesStatus: "Normal" | "Extended" | "Shortened" | 0 | 1 | 2;
};

export type ConferenceHighlight = {
    text: string;
};

export type ConferenceScope = {
    name: string;
};

export type ConferenceStat = {
    title: string;
    description: string;
    icon: "users" | "fileText" | "calendar";
    tone: "blue" | "green" | "purple";
};