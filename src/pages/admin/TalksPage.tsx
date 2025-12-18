import { useEffect, useMemo, useState } from "react";
import type { Conference, Day, Session, Theme } from "../../types/types.ts";
import { getConferenceById } from "../../api/conferenceApi.ts";
import { getDaysByConference } from "../../api/dayApi.ts";
import { createTalk, deleteTalk } from "../../api/talkApi.ts";
import { AdminPage, AdminHeader, AdminCreate, AdminEmpty, AdminButton, TextField, SelectField } from "../../components/admin/ui";
import ConferenceInfo from "../../components/admin/shared/ConferenceInfo.tsx";
import TalksList from "../../components/admin/lists/TalksList.tsx";

const TalksPage = () => {
    const conferenceId = Number(localStorage.getItem("admin.selectedConferenceId"));
    const [conference, setConference] = useState<Conference | null>(null);
    const [days, setDays] = useState<Day[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [selectedThemeId, setSelectedThemeId] = useState("");

    useEffect(() => { if (conferenceId) load(); }, [conferenceId]);

    const load = async () => {
        const [conf, daysData] = await Promise.all([
            getConferenceById(conferenceId),
            getDaysByConference(conferenceId)
        ]);
        setConference(conf);
        setDays(daysData);
    };

    const themesFlat = useMemo(() => {
        const out: { day: Day; session: Session; theme: Theme }[] = [];
        for (const d of days) {
            for (const s of d.session ?? []) {
                if (!s) continue;
                for (const t of s.theme ?? []) {
                    if (t) out.push({ day: d, session: s, theme: t });
                }
            }
        }
        return out;
    }, [days]);

    const handleCreate = async () => {
        if (!title || !startTime || !endTime || !selectedThemeId) return;
        await createTalk({ title, content, startTime, endTime, themeId: Number(selectedThemeId) });
        setTitle(""); setContent(""); setStartTime(""); setEndTime(""); setSelectedThemeId("");
        load();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete talk?")) return;
        await deleteTalk(id);
        load();
    };

    if (!conferenceId || !conference) {
        return <AdminPage><AdminEmpty>No conference selected</AdminEmpty></AdminPage>;
    }

    const themeOptions = themesFlat.map(({ day, session, theme }) => ({
        value: theme.id,
        label: `${day.date} • ${session.title} • ${theme.title}`
    }));

    return (
        <AdminPage>
            <AdminHeader title="Talks" subtitle={<ConferenceInfo conference={conference} />} />

            <AdminCreate title="Add talk">
                <TextField label="Title" value={title} onChange={setTitle} placeholder="Talk title" />
                <SelectField label="Theme (with context)" value={selectedThemeId} onChange={setSelectedThemeId} options={themeOptions} placeholder="Select theme" />
                <TextField label="Content" value={content} onChange={setContent} placeholder="Optional description" />
                <TextField label="Start" type="time" value={startTime} onChange={setStartTime} />
                <TextField label="End" type="time" value={endTime} onChange={setEndTime} />
                <AdminButton onClick={handleCreate}>Add</AdminButton>
            </AdminCreate>

            <TalksList days={days} onDelete={handleDelete} />
        </AdminPage>
    );
};

export default TalksPage;