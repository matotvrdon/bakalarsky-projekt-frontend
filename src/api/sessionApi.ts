import { api } from "./baseApi";
import type { Session } from "../types/types";

export const createSession = (data: {
    title: string;
    startTime: string;
    endTime: string;
    dayId: number;
}): Promise<Session> => {
    return api("/api/session/add-session", {
        method: "POST",
        json: data
    });
};

export const deleteSession = (sessionId: number): Promise<void> => {
    return api(`/api/session/delete-session/${sessionId}`, {
        method: "DELETE"
    });
};