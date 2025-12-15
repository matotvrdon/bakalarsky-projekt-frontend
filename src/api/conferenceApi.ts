import { api } from "./baseApi";
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
        json: data
    });
};

export const deleteConference = (id: number): Promise<void> => {
    return api(`/api/conference/${id}`, {
        method: "DELETE"
    });
};