import { api } from "./baseApi";
import type { Day } from "../types/types";

export const getDaysByConference = (conferenceId: number): Promise<Day[]> => {
    return api(`/api/day/day-by-conference-id/${conferenceId}`);
};

export const createDay = (data: {
    date: string;
    conferenceId: number;
}): Promise<Day> => {
    return api("/api/day/add-day", {
        method: "POST",
        json: data
    });
};

export const deleteDay = (dayId: number): Promise<void> => {
    return api(`/api/day/delete-day/${dayId}`, {
        method: "DELETE"
    });
};