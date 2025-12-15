import {api} from "./baseApi.ts";

export type PublicPageResponse = {
    slug: string;
    title: string;
    publishedJson: string;
}

export const getPublicPage = (slug: string): Promise<PublicPageResponse> =>{
    return api(`/api/content-page/public/${slug}`);
}

export const getPreviewPage = (slug: string) => {
    return api(`/api/content-page/public/${slug}?preview=true`);
};