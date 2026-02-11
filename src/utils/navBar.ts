import type { IsActiveStatus } from "../types/types";

export const isMenuActive = (status: IsActiveStatus) => {
    if (status === true) return true;
    if (status === false || status == null) return false;
    if (typeof status === "number") return status === 1;
    if (typeof status === "string") return status.toLowerCase() === "active";
    return false;
};

export const buildNavPath = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return "/";

    const lower = trimmed.toLowerCase();
    if (lower === "overview" || lower === "home") return "/";
    if (trimmed.startsWith("/")) return trimmed;

    const slug = lower
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return slug ? `/${slug}` : "/";
};
