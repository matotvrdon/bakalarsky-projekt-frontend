import { api } from "./baseApi";
import type { PageContent } from "../types/types";

export const getAllPageContents = (): Promise<PageContent[]> => {
    return api("/api/page-content/get-all");
};

export const getPageContentById = (pageContentId: number): Promise<PageContent> => {
    return api(`/api/page-content/get-by-id/${pageContentId}`);
};

export const getPageContentByNavBarMenuId = (navBarMenuId: number): Promise<PageContent> => {
    return api(`/api/page-content/page-content-by-nav-bar-menu-id/${navBarMenuId}`);
};

export const createPageContent = (data: {
    title: string;
    markdown: string;
    html: string;
    navBarMenuId: number;
}): Promise<PageContent> => {
    return api("/api/page-content/add-page-content", {
        method: "POST",
        json: data
    });
};

export const updatePageContent = (data: {
    id: number;
    title: string;
    markdown: string;
    html: string;
    navBarMenuId: number;
}): Promise<PageContent> => {
    return api("/api/page-content/update-page-content", {
        method: "PUT",
        json: data
    });
};

export const deletePageContent = (pageContentId: number): Promise<void> => {
    return api(`/api/page-content/delete-page-content/${pageContentId}`, {
        method: "DELETE"
    });
};
