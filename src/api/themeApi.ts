import { api } from "./baseApi";
import type { Theme } from "../types/types";

export const createTheme = (data: {
    title: string;
    startTime: string; // HH:mm
    endTime: string;   // HH:mm
    chair: string;
    sessionId: number;
}): Promise<Theme> => {
    return api("/api/theme/add-theme", {
        method: "POST",
        json: data
    });
};

export const deleteTheme = (themeId: number): Promise<void> => {
    return api(`/api/theme/delete-theme/${themeId}`, {
        method: "DELETE"
    });
};