import { api } from "./baseApi";
import { toUtcIsoDate } from "../utils/date";
import type { Conference } from "../types/types";

export const getAllConferences = (): Promise<Conference[]> => {
    return api("/api/conference/get-all");
};

export const getConferenceById = (id: number): Promise<Conference> => {
    return api(`/api/conference/get-by-id/${id}`);
};

export const createConference = (data: {
    name: string;
    startDate: string; // YYYY-MM-DD
    endDate: string;
}): Promise<Conference> => {
    return api("/api/conference", {
        method: "POST",
        json: {
            ...data,
            startDate: toUtcIsoDate(data.startDate),
            endDate: toUtcIsoDate(data.endDate)
        }
    });
};

export const deleteConference = (id: number): Promise<void> => {
    return api(`/api/conference/${id}`, {
        method: "DELETE"
    });
};
