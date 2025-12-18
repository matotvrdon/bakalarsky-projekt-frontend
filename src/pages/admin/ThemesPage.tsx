import { useEffect, useMemo, useState } from "react";
import type { Conference, Day, Session } from "../../types/types.ts";
import { getConferenceById } from "../../api/conferenceApi.ts";
import { getDaysByConference } from "../../api/dayApi.ts";
import { createTheme, deleteTheme } from "../../api/themeApi.ts";
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
import ThemesList from "../../components/admin/lists/ThemesList.tsx";

const ThemesPage = () => {
    const conferenceId = Number(localStorage.getItem("admin.selectedConferenceId"));

    const [conference, setConference] = useState<Conference | null>(null);
    const [days, setDays] = useState<Day[]>([]);

    const [title, setTitle] = useState("");
    const [chair, setChair] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [selectedSessionId, setSelectedSessionId] = useState("");

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

    const sessionsFlat = useMemo(() => {
        const out: { day: Day; session: Session }[] = [];
        for (const d of days) {
            for (const s of d.session ?? []) {
                if (s) out.push({ day: d, session: s });
            }
        }
        return out;
    }, [days]);

    const handleCreate = async () => {
        if (!title || !chair || !startTime || !endTime || !selectedSessionId) return;
        await createTheme({ title, chair, startTime, endTime, sessionId: Number(selectedSessionId) });
        setTitle(""); setChair(""); setStartTime(""); setEndTime(""); setSelectedSessionId("");
        load();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete theme?")) return;
        await deleteTheme(id);
        load();
    };

    if (!conferenceId || !conference) {
        return <AdminPage><AdminEmpty>No conference selected</AdminEmpty></AdminPage>;
    }

    const sessionOptions = sessionsFlat.map(({ day, session }) => ({
        value: session.id,
        label: `${day.date} • ${session.title} (${session.startTime}-${session.endTime})`
    }));

    return (
        <AdminPage>
            <AdminHeader title="Themes" subtitle={<ConferenceInfo conference={conference} />} />

            <AdminCreate title="Add theme">
                <TextField label="Title" value={title} onChange={setTitle} placeholder="Theme title" />
                <SelectField label="Session (with day)" value={selectedSessionId} onChange={setSelectedSessionId} options={sessionOptions} placeholder="Select session" />
                <TextField label="Chair" value={chair} onChange={setChair} placeholder="Chair name" />
                <TextField label="Start" type="time" value={startTime} onChange={setStartTime} />
                <TextField label="End" type="time" value={endTime} onChange={setEndTime} />
                <AdminButton onClick={handleCreate}>Add</AdminButton>
            </AdminCreate>

            <ThemesList days={days} onDelete={handleDelete} />
        </AdminPage>
    );
};

export default ThemesPage;