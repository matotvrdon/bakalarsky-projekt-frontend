import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Conference } from "../../types/types.ts";
import { getAllConferences, createConference, deleteConference } from "../../api/conferenceApi.ts";
import { AdminPage, AdminHeader, AdminCreate, AdminButton, TextField } from "../../components/admin/ui";
import ConferencesList from "../../components/admin/lists/ConferencesList.tsx";

const ConferencesPage = () => {
    const [conferences, setConferences] = useState<Conference[]>([]);
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const navigate = useNavigate();

    useEffect(() => { load(); }, []);

    const load = async () => setConferences(await getAllConferences());

    const handleCreate = async () => {
        if (!name || !startDate || !endDate) return;
        await createConference({ name, startDate, endDate });
        setName(""); setStartDate(""); setEndDate("");
        load();
    };

    const handleManage = (id: number) => {
        localStorage.setItem("admin.selectedConferenceId", id.toString());
        window.dispatchEvent(new Event("conferenceSelected"));
        navigate(`/admin/conference/${id}`);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete conference?")) return;
        await deleteConference(id);
        load();
    };

    return (
        <AdminPage>
            <AdminHeader title="Conferences" />

            <AdminCreate title="Create new conference">
                <TextField label="Name" value={name} onChange={setName} placeholder="Conference name" />
                <TextField label="Start date" type="date" value={startDate} onChange={setStartDate} />
                <TextField label="End date" type="date" value={endDate} onChange={setEndDate} />
                <AdminButton onClick={handleCreate}>Create</AdminButton>
            </AdminCreate>

            <ConferencesList conferences={conferences} onManage={handleManage} onDelete={handleDelete} />
        </AdminPage>
    );
};

export default ConferencesPage;