import { api } from "./baseApi";
import type { IsActiveStatus, NavBarMenu } from "../types/types";

export const getAllNavBarMenus = (): Promise<NavBarMenu[]> => {
    return api("/api/nav-bar-menu/get-all");
};

export const getAllNavBarMenusQuery = (query?: string): Promise<NavBarMenu[]> => {
    const suffix = query ? `?${query}` : "";
    return api(`/api/nav-bar-menu/get-all-query${suffix}`);
};

export const getNavBarMenuById = (navBarMenuId: number): Promise<NavBarMenu> => {
    return api(`/api/nav-bar-menu/get-by-id/${navBarMenuId}`);
};

export const createNavBarMenu = (data: {
    name: string;
    isActive: IsActiveStatus;
}): Promise<NavBarMenu> => {
    return api("/api/nav-bar-menu/add-nav-bar-menu", {
        method: "POST",
        json: data
    });
};

export const updateNavBarMenu = (data: {
    id: number;
    name: string;
    isActive: IsActiveStatus;
}): Promise<NavBarMenu> => {
    return api("/api/nav-bar-menu/update-nav-bar-menu", {
        method: "PUT",
        json: data
    });
};

export const deleteNavBarMenu = (navBarMenuId: number): Promise<void> => {
    return api(`/api/nav-bar-menu/delete-nav-bar-menu/${navBarMenuId}`, {
        method: "DELETE"
    });
};
