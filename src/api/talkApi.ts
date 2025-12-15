import { api } from "./baseApi";
import type { Talk } from "../types/types";

export const createTalk = (data: {
    themeId: number;
    title: string;
    content: string;
    startTime: string;
    endTime: string;
}): Promise<Talk> => {
    return api("/api/talk/add-talk", {
        method: "POST",
        json: {
            title: data.title,
            content: data.content,
            startTime: data.startTime,
            endTime: data.endTime,
            themeId: data.themeId
        }
    });
};

export const updateTalk = (id: number, data: {
    title: string;
    content: string;
    startTime: string;
    endTime: string;
}): Promise<Talk> => {
    return api(`/api/talk/${id}`, {
        method: "PUT",
        json: {
            id,
            title: data.title,
            content: data.content,
            startTime: data.startTime,
            endTime: data.endTime
        }
    });
};

export const deleteTalk = (talkId: number): Promise<void> => {
    return api(`/api/talk/delete-talk/${talkId}`, {
        method: "DELETE"
    });
};