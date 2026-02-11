import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./PageContentPage.module.css";
import { getAllNavBarMenus } from "../../api/navBarMenuApi.ts";
import { getPageContentByNavBarMenuId } from "../../api/pageContentApi.ts";
import type { NavBarMenu, PageContent } from "../../types/types";
import { buildNavPath, isMenuActive } from "../../utils/navBar";

const normalizePath = (pathname: string) => {
    const trimmed = pathname.replace(/\/+$/, "");
    return trimmed === "" ? "/" : trimmed;
};

const PageContentPage = () => {
    const location = useLocation();
    const [menus, setMenus] = useState<NavBarMenu[]>([]);
    const [content, setContent] = useState<PageContent | null>(null);
    const [loadingMenus, setLoadingMenus] = useState(true);
    const [loadingContent, setLoadingContent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        setLoadingMenus(true);
        getAllNavBarMenus()
            .then((data) => {
                if (!isMounted) return;
                setMenus(Array.isArray(data) ? data : []);
            })
            .catch(() => {
                if (!isMounted) return;
                setError("Failed to load navigation.");
            })
            .finally(() => {
                if (!isMounted) return;
                setLoadingMenus(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const currentPath = useMemo(
        () => normalizePath(location.pathname),
        [location.pathname]
    );

    const currentMenu = useMemo(() => {
        return menus
            .filter((item) => isMenuActive(item.isActive))
            .filter((item) => item.name.trim().toLowerCase() !== "admin")
            .find((item) => buildNavPath(item.name) === currentPath) ?? null;
    }, [menus, currentPath]);

    useEffect(() => {
        if (loadingMenus) return;
        if (!currentMenu) {
            setContent(null);
            setError(null);
            setLoadingContent(false);
            return;
        }

        let isMounted = true;
        setLoadingContent(true);
        setError(null);

        getPageContentByNavBarMenuId(currentMenu.id)
            .then((data) => {
                if (!isMounted) return;
                setContent(data);
            })
            .catch(() => {
                if (!isMounted) return;
                setContent(null);
                setError("Content not available.");
            })
            .finally(() => {
                if (!isMounted) return;
                setLoadingContent(false);
            });

        return () => {
            isMounted = false;
        };
    }, [currentMenu?.id, loadingMenus]);

    const htmlContent = content?.html ?? content?.Html ?? "";
    const title = content?.title ?? content?.Title ?? "";

    return (
        <div className={`${styles.page} page-inner`}>
            {loadingMenus || loadingContent ? (
                <div className={styles.state}>Loading content...</div>
            ) : error ? (
                <div className={styles.state}>{error}</div>
            ) : !currentMenu ? (
                <div className={styles.state}>Page not found.</div>
            ) : htmlContent ? (
                <>
                    {title && <h1 className={styles.title}>{title}</h1>}
                    <div
                        className={styles.content}
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                </>
            ) : (
                <div className={styles.state}>No content yet.</div>
            )}
        </div>
    );
};

export default PageContentPage;
