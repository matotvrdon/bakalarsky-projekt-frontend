import type {CmsBlock} from "./cms/types.ts";
import {useEffect, useState} from "react";
import {getPreviewPage, getPublicPage} from "../api/contentPagesApi.ts";
import {BlockRenderer} from "./cms/render/BlockRenderer.tsx";

interface Props {
    slug: string;
    preview?: boolean;
}

export const CmsContent: React.FC<Props> = ({ slug, preview }) => {
    const [blocks, setBlocks] = useState<CmsBlock[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError("");

                const res = preview
                    ? await getPreviewPage(slug)
                    : await getPublicPage(slug);

                const parsed = JSON.parse(res.publishedJson);
                const blocksArr = Array.isArray(parsed)
                    ? parsed
                    : parsed.blocks ?? [];

                setBlocks(blocksArr);
            } catch (e: any) {
                setError(e?.message ?? "Failed to load content");
            } finally {
                setLoading(false);
            }
        })();
    }, [slug, preview]);

    if (loading) return <p>Loading…</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return <BlockRenderer blocks={blocks} />;
};