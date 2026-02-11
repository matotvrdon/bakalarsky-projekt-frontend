import { useEffect, useState } from "react";
import type { NavBarMenu, PageContent } from "../../types/types";
import {
    getAllPageContents,
    createPageContent,
    updatePageContent,
    deletePageContent
} from "../../api/pageContentApi.ts";
import { getAllNavBarMenus } from "../../api/navBarMenuApi.ts";
import {
    AdminPage,
    AdminHeader,
    AdminCreate,
    AdminList,
    AdminCard,
    AdminEmpty,
    AdminButton,
    TextField,
    TextAreaField,
    SelectField
} from "../../components/admin/ui";

const PageContentPage = () => {
    const [contents, setContents] = useState<PageContent[]>([]);
    const [menus, setMenus] = useState<NavBarMenu[]>([]);
    const [title, setTitle] = useState("");
    const [markdown, setMarkdown] = useState("");
    const [html, setHtml] = useState("");
    const [selectedMenuId, setSelectedMenuId] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        const [menuData, contentData] = await Promise.all([
            getAllNavBarMenus(),
            getAllPageContents()
        ]);
        setMenus(Array.isArray(menuData) ? menuData : []);
        setContents(Array.isArray(contentData) ? contentData : []);
    };

    const resetForm = () => {
        setTitle("");
        setMarkdown("");
        setHtml("");
        setSelectedMenuId("");
        setEditingId(null);
    };

    const handleSave = async () => {
        const trimmedTitle = title.trim();
        if (!trimmedTitle || !selectedMenuId) return;

        const payload = {
            title: trimmedTitle,
            markdown,
            html,
            navBarMenuId: Number(selectedMenuId)
        };

        if (editingId != null) {
            await updatePageContent({ id: editingId, ...payload });
        } else {
            await createPageContent(payload);
        }

        resetForm();
        load();
    };

    const handleEdit = (item: PageContent) => {
        const menuId = item.navBarMenuId ?? item.NavBarMenuId;
        setEditingId(item.id);
        setTitle(item.title ?? item.Title ?? "");
        setMarkdown(item.markdown ?? item.Markdown ?? "");
        setHtml(item.html ?? item.Html ?? "");
        setSelectedMenuId(menuId != null ? String(menuId) : "");
    };

    const handleCancel = () => {
        resetForm();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete page content?")) return;
        await deletePageContent(id);
        if (editingId === id) resetForm();
        load();
    };

    const menuOptions = menus.map((menu) => ({
        value: menu.id,
        label: menu.name
    }));

    const getMenuName = (menuId?: number) =>
        menuId != null
            ? menus.find((menu) => menu.id === menuId)?.name ?? "Unknown"
            : "Unknown";

    return (
        <AdminPage>
            <AdminHeader
                title="Content Pages"
                subtitle="Maintain page content that renders in the public site."
            />

            <AdminCreate title={editingId != null ? "Update page content" : "Create page content"}>
                <TextField
                    label="Title"
                    value={title}
                    onChange={setTitle}
                    placeholder="Page title"
                />
                <SelectField
                    label="Nav bar item"
                    value={selectedMenuId}
                    onChange={setSelectedMenuId}
                    options={menuOptions}
                    placeholder="Select menu"
                />
                <TextAreaField
                    label="Markdown"
                    value={markdown}
                    onChange={setMarkdown}
                    placeholder="Markdown source"
                    rows={6}
                />
                <TextAreaField
                    label="Html"
                    value={html}
                    onChange={setHtml}
                    placeholder="Rendered HTML"
                    rows={8}
                />
                <AdminButton onClick={handleSave}>
                    {editingId != null ? "Update content" : "Create content"}
                </AdminButton>
                {editingId != null && (
                    <AdminButton variant="secondary" onClick={handleCancel}>
                        Cancel
                    </AdminButton>
                )}
            </AdminCreate>

            {contents.length === 0 ? (
                <AdminEmpty>No content pages yet</AdminEmpty>
            ) : (
                <AdminList>
                    {contents.map((item) => {
                        const menuId = item.navBarMenuId ?? item.NavBarMenuId;
                        return (
                            <AdminCard
                                key={item.id}
                                title={item.title ?? item.Title ?? "Untitled"}
                                subtitle={`Menu: ${getMenuName(menuId)}`}
                                actions={
                                    <>
                                        <AdminButton variant="secondary" onClick={() => handleEdit(item)}>
                                            Edit
                                        </AdminButton>
                                        <AdminButton variant="danger" onClick={() => handleDelete(item.id)}>
                                            Delete
                                        </AdminButton>
                                    </>
                                }
                            />
                        );
                    })}
                </AdminList>
            )}
        </AdminPage>
    );
};

export default PageContentPage;
