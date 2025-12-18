import { useEffect, useState } from "react";
import type { Day, Conference } from "../../types/types.ts";
import { getDaysByConference, createDay, deleteDay } from "../../api/dayApi.ts";
import { getConferenceById } from "../../api/conferenceApi.ts";
import { AdminPage, AdminHeader, AdminCreate, AdminEmpty, AdminButton, TextField } from "../../components/admin/ui";
import ConferenceInfo from "../../components/admin/shared/ConferenceInfo.tsx";
import DaysList from "../../components/admin/lists/DaysList.tsx";

const DaysPage = () => {
    const conferenceId = Number(localStorage.getItem("admin.selectedConferenceId"));
    const [conference, setConference] = useState<Conference | null>(null);
    const [days, setDays] = useState<Day[]>([]);
    const [date, setDate] = useState("");

    useEffect(() => { if (conferenceId) load(); }, [conferenceId]);

    const load = async () => {
        const [conf, daysData] = await Promise.all([
            getConferenceById(conferenceId),
            getDaysByConference(conferenceId)
        ]);
        setConference(conf);
        setDays(daysData);
    };

    const handleCreate = async () => {
        if (!date) return;
        await createDay({ date, conferenceId });
        setDate("");
        load();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete day?")) return;
        await deleteDay(id);
        load();
    };

    if (!conferenceId || !conference) {
        return <AdminPage><AdminEmpty>No conference selected</AdminEmpty></AdminPage>;
    }

    return (
        <AdminPage>
            <AdminHeader title="Days" subtitle={<ConferenceInfo conference={conference} />} />

            <AdminCreate title="Add day">
                <TextField label="Date" type="date" value={date} onChange={setDate} />
                <AdminButton onClick={handleCreate}>Add</AdminButton>
            </AdminCreate>

            <DaysList days={days} onDelete={handleDelete} />
        </AdminPage>
    );
};

export default DaysPage;