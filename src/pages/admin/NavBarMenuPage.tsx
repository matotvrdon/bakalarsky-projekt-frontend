import { useEffect, useState } from "react";
import type { IsActiveStatus, NavBarMenu } from "../../types/types";
import {
    getAllNavBarMenus,
    createNavBarMenu,
    updateNavBarMenu,
    deleteNavBarMenu
} from "../../api/navBarMenuApi.ts";
import {
    AdminPage,
    AdminHeader,
    AdminCreate,
    AdminList,
    AdminCard,
    AdminEmpty,
    AdminButton,
    TextField,
    SelectField
} from "../../components/admin/ui";
import { isMenuActive } from "../../utils/navBar";

type StatusValue = 0 | 1;

const STATUS_OPTIONS = [
    { value: 1, label: "Active" },
    { value: 0, label: "Inactive" }
];

const toStatusValue = (status: IsActiveStatus): StatusValue =>
    isMenuActive(status) ? 1 : 0;

const statusLabel = (status: IsActiveStatus) =>
    isMenuActive(status) ? "Active" : "Inactive";

const NavBarMenuPage = () => {
    const [menuItems, setMenuItems] = useState<NavBarMenu[]>([]);
    const [name, setName] = useState("");
    const [status, setStatus] = useState<StatusValue>(1);
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        const data = await getAllNavBarMenus();
        setMenuItems(Array.isArray(data) ? data : []);
    };

    const resetForm = () => {
        setName("");
        setStatus(1);
        setEditingId(null);
    };

    const handleSave = async () => {
        const trimmed = name.trim();
        if (!trimmed) return;

        const payload = { name: trimmed, isActive: status };
        if (editingId != null) {
            await updateNavBarMenu({ id: editingId, ...payload });
        } else {
            await createNavBarMenu(payload);
        }

        resetForm();
        load();
    };

    const handleEdit = (item: NavBarMenu) => {
        setEditingId(item.id);
        setName(item.name);
        setStatus(toStatusValue(item.isActive));
    };

    const handleCancel = () => {
        resetForm();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete nav bar menu item?")) return;
        await deleteNavBarMenu(id);
        if (editingId === id) resetForm();
        load();
    };

    return (
        <AdminPage>
            <AdminHeader
                title="Nav Bar"
                subtitle="Manage the navigation items shown in the public header."
            />

            <AdminCreate title={editingId != null ? "Update nav bar item" : "Create nav bar item"}>
                <TextField
                    label="Label"
                    value={name}
                    onChange={setName}
                    placeholder="Menu label"
                />
                <SelectField
                    label="Status"
                    value={status}
                    onChange={(value) => setStatus(Number(value) as StatusValue)}
                    options={STATUS_OPTIONS}
                />
                <AdminButton onClick={handleSave}>
                    {editingId != null ? "Update item" : "Create item"}
                </AdminButton>
                {editingId != null && (
                    <AdminButton variant="secondary" onClick={handleCancel}>
                        Cancel
                    </AdminButton>
                )}
            </AdminCreate>

            {menuItems.length === 0 ? (
                <AdminEmpty>No nav bar items yet</AdminEmpty>
            ) : (
                <AdminList>
                    {menuItems.map((item) => (
                        <AdminCard
                            key={item.id}
                            title={item.name}
                            subtitle={`ID: ${item.id} - ${statusLabel(item.isActive)}`}
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
                    ))}
                </AdminList>
            )}
        </AdminPage>
    );
};

export default NavBarMenuPage;
