import { useEffect, useState } from "react";
import type { Conference, Day } from "../../types/types.ts";
import { getConferenceById } from "../../api/conferenceApi.ts";
import { getDaysByConference } from "../../api/dayApi.ts";
import { createSession, deleteSession } from "../../api/sessionApi.ts";
import {
    AdminPage,
    AdminHeader,
    AdminCreate,
    AdminEmpty,
    AdminButton,
    TextField,
    SelectField
} from "../../components/admin/ui";
import ConferenceInfo from "../../components/admin/shared/ConferenceInfo.tsx";
import SessionsList from "../../components/admin/lists/SessionsList.tsx";

const SessionsPage = () => {
    const conferenceId = Number(localStorage.getItem("admin.selectedConferenceId"));

    const [conference, setConference] = useState<Conference | null>(null);
    const [days, setDays] = useState<Day[]>([]);
    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [selectedDayId, setSelectedDayId] = useState("");

    useEffect(() => {
        if (conferenceId) load();
    }, [conferenceId]);

    const load = async () => {
        const [conf, daysData] = await Promise.all([
            getConferenceById(conferenceId),
            getDaysByConference(conferenceId)
        ]);
        setConference(conf);
        setDays(daysData);
    };

    const handleCreate = async () => {
        if (!title || !startTime || !endTime || !selectedDayId) return;

        await createSession({
            title,
            startTime,
            endTime,
            dayId: Number(selectedDayId)
        });

        setTitle("");
        setStartTime("");
        setEndTime("");
        setSelectedDayId("");
        load();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete session?")) return;
        await deleteSession(id);
        load();
    };

    if (!conferenceId || !conference) {
        return (
            <AdminPage>
                <AdminEmpty>No conference selected</AdminEmpty>
            </AdminPage>
        );
    }

    const dayOptions = days.map((d) => ({ value: d.id, label: d.date }));

    return (
        <AdminPage>
            <AdminHeader
                title="Sessions"
                subtitle={<ConferenceInfo conference={conference} />}
            />

            <AdminCreate title="Add session">
                <TextField
                    label="Title"
                    value={title}
                    onChange={setTitle}
                    placeholder="Session title"
                />
                <SelectField
                    label="Day"
                    value={selectedDayId}
                    onChange={setSelectedDayId}
                    options={dayOptions}
                    placeholder="Select day"
                />
                <TextField label="Start" type="time" value={startTime} onChange={setStartTime} />
                <TextField label="End" type="time" value={endTime} onChange={setEndTime} />
                <AdminButton onClick={handleCreate}>Add</AdminButton>
            </AdminCreate>

            <SessionsList days={days} onDelete={handleDelete} />
        </AdminPage>
    );
};

export default SessionsPage;