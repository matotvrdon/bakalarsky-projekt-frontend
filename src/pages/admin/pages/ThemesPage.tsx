import { useEffect, useMemo, useState } from "react";
import type { Conference, Day, Session } from "../../../types/types";
import { getConferenceById } from "../../../api/conferenceApi";
import { getDaysByConference } from "../../../api/dayApi";
import { createTheme, deleteTheme } from "../../../api/themeApi";

type SessionWithDay = { day: Day; session: Session };

const ThemesPage = () => {
    const conferenceId = Number(localStorage.getItem("admin.selectedConferenceId"));

    const [conference, setConference] = useState<Conference | null>(null);
    const [days, setDays] = useState<Day[]>([]);

    const [title, setTitle] = useState("");
    const [chair, setChair] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [selectedSessionId, setSelectedSessionId] = useState<number | "">("");

    useEffect(() => {
        if (!conferenceId) return;
        load();
    }, [conferenceId]);

    const load = async () => {
        const [conf, daysData] = await Promise.all([
            getConferenceById(conferenceId),
            getDaysByConference(conferenceId)
        ]);

        setConference(conf);
        setDays(daysData);
    };

    const sessionsFlat: SessionWithDay[] = useMemo(() => {
        const out: SessionWithDay[] = [];
        for (const d of days) {
            for (const s of d.session ?? []) {
                out.push({ day: d, session: s });
            }
        }
        return out;
    }, [days]);

    const handleCreate = async () => {
        if (!title || !chair || !startTime || !endTime || !selectedSessionId) return;

        await createTheme({
            title,
            chair,
            startTime,
            endTime,
            sessionId: Number(selectedSessionId)
        });

        setTitle("");
        setChair("");
        setStartTime("");
        setEndTime("");
        setSelectedSessionId("");
        load();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete theme?")) return;
        await deleteTheme(id);
        load();
    };

    if (!conferenceId || !conference) {
        return (
            <div className="admin-page">
                <div className="admin-empty">No conference selected</div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            {/* HEADER */}
            <div className="admin-header">
                <div>
                    <h1>Themes</h1>
                    <p className="admin-subtitle">
                        Conference: <strong>{conference.name}</strong><br />
                        {conference.startDate} → {conference.endDate}
                    </p>
                </div>
            </div>

            {/* CREATE */}
            <div className="admin-create">
                <h2>Add theme</h2>

                <div className="admin-form">
                    <div className="admin-field">
                        <label className="admin-label">Title</label>
                        <input
                            className="admin-input"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Theme title"
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Session (with day)</label>
                        <select
                            className="admin-input"
                            value={selectedSessionId}
                            onChange={e => setSelectedSessionId(e.target.value ? Number(e.target.value) : "")}
                        >
                            <option value="">Select session</option>
                            {sessionsFlat.map(({ day, session }) => (
                                <option key={session.id} value={session.id}>
                                    {day.date} • {session.title} ({session.startTime}-{session.endTime})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Chair</label>
                        <input
                            className="admin-input"
                            value={chair}
                            onChange={e => setChair(e.target.value)}
                            placeholder="Chair name"
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Start</label>
                        <input
                            type="time"
                            lang="en-GB"
                            className="admin-input"
                            value={startTime}
                            onChange={e => setStartTime(e.target.value)}
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">End</label>
                        <input
                            type="time"
                            lang="en-GB"
                            className="admin-input"
                            value={endTime}
                            onChange={e => setEndTime(e.target.value)}
                        />
                    </div>

                    <button className="admin-btn" onClick={handleCreate}>
                        Add
                    </button>
                </div>
            </div>

            {/* LIST: Day -> Session -> Themes */}
            {days.length === 0 ? (
                <div className="admin-empty">No days created</div>
            ) : (
                days.map(day => (
                    <section key={day.id} style={{ marginBottom: 32 }}>
                        <h3 style={{ marginBottom: 12 }}>{day.date}</h3>

                        {(day.session ?? []).length === 0 ? (
                            <div className="admin-empty">No sessions for this day</div>
                        ) : (
                            (day.session ?? []).map(session => (
                                <div key={session.id} style={{ marginBottom: 18 }}>
                                    <div style={{ marginBottom: 10, fontWeight: 600 }}>
                                        {session.title}{" "}
                                        <span style={{ color: "#64748b", fontWeight: 500 }}>
                                            ({session.startTime} – {session.endTime})
                                        </span>
                                    </div>

                                    {(session.theme ?? []).length === 0 ? (
                                        <div className="admin-empty">No themes in this session</div>
                                    ) : (
                                        <div className="admin-list">
                                            {(session.theme ?? []).map(t => (
                                                <div key={t.id} className="admin-card">
                                                    <div>
                                                        <h3>{t.title}</h3>
                                                        <p>
                                                            {t.startTime} – {t.endTime} • Chair: {t.chair}
                                                        </p>
                                                    </div>

                                                    <div className="admin-actions">
                                                        <button
                                                            className="admin-btn danger"
                                                            onClick={() => handleDelete(t.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </section>
                ))
            )}
        </div>
    );
};

export default ThemesPage;