import { useEffect, useMemo, useState } from "react";
import type { Conference, Day, Session, Theme } from "../../../types/types";
import { getConferenceById } from "../../../api/conferenceApi";
import { getDaysByConference } from "../../../api/dayApi";
import { createTalk, deleteTalk } from "../../../api/talkApi";

type ThemeWithContext = {
    day: Day;
    session: Session;
    theme: Theme;
};

const TalksPage = () => {
    const conferenceId = Number(localStorage.getItem("admin.selectedConferenceId"));

    const [conference, setConference] = useState<Conference | null>(null);
    const [days, setDays] = useState<Day[]>([]);

    // form
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [selectedThemeId, setSelectedThemeId] = useState<number | "">("");

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

    /**
     * Flatten themes with context (day + session)
     */
    const themesFlat: ThemeWithContext[] = useMemo(() => {
        const out: ThemeWithContext[] = [];

        for (const d of days) {
            for (const s of d.session ?? []) {
                for (const t of s.theme ?? []) {
                    out.push({ day: d, session: s, theme: t });
                }
            }
        }

        return out;
    }, [days]);

    const handleCreate = async () => {
        if (!title || !startTime || !endTime || !selectedThemeId) return;

        await createTalk({
            title,
            content,
            startTime,
            endTime,
            themeId: Number(selectedThemeId)
        });

        setTitle("");
        setContent("");
        setStartTime("");
        setEndTime("");
        setSelectedThemeId("");
        load();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete talk?")) return;
        await deleteTalk(id);
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
                    <h1>Talks</h1>
                    <p className="admin-subtitle">
                        Conference: <strong>{conference.name}</strong><br />
                        {conference.startDate} → {conference.endDate}
                    </p>
                </div>
            </div>

            {/* CREATE */}
            <div className="admin-create">
                <h2>Add talk</h2>

                <div className="admin-form">
                    <div className="admin-field">
                        <label className="admin-label">Title</label>
                        <input
                            className="admin-input"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Talk title"
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Theme (with context)</label>
                        <select
                            className="admin-input"
                            value={selectedThemeId}
                            onChange={e =>
                                setSelectedThemeId(e.target.value ? Number(e.target.value) : "")
                            }
                        >
                            <option value="">Select theme</option>
                            {themesFlat.map(({ day, session, theme }) => (
                                <option key={theme.id} value={theme.id}>
                                    {day.date} • {session.title} • {theme.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Content</label>
                        <input
                            className="admin-input"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="Optional description"
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

            {/* LIST */}
            {days.length === 0 ? (
                <div className="admin-empty">No days created</div>
            ) : (
                days.map(day => (
                    <section key={day.id} style={{ marginBottom: 32 }}>
                        <h3 style={{ marginBottom: 12 }}>{day.date}</h3>

                        {(day.session ?? []).map(session => (
                            <div key={session.id} style={{ marginBottom: 20 }}>
                                <div style={{ marginBottom: 10, fontWeight: 600 }}>
                                    {session.title}{" "}
                                    <span style={{ color: "#64748b", fontWeight: 500 }}>
                                        ({session.startTime} – {session.endTime})
                                    </span>
                                </div>

                                {(session.theme ?? []).map(theme => (
                                    <div key={theme.id} style={{ marginBottom: 16 }}>
                                        <div style={{ fontWeight: 500, marginBottom: 6 }}>
                                            Theme: {theme.title}
                                        </div>

                                        {(theme.talk ?? []).length === 0 ? (
                                            <div className="admin-empty">
                                                No talks in this theme
                                            </div>
                                        ) : (
                                            <div className="admin-list">
                                                {(theme.talk ?? []).map(talk => (
                                                    <div key={talk.id} className="admin-card">
                                                        <div>
                                                            <h3>{talk.title}</h3>
                                                            <p>
                                                                {talk.startTime} – {talk.endTime}
                                                            </p>
                                                            {talk.content && (
                                                                <p style={{ marginTop: 6 }}>
                                                                    {talk.content}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="admin-actions">
                                                            <button
                                                                className="admin-btn danger"
                                                                onClick={() => handleDelete(talk.id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </section>
                ))
            )}
        </div>
    );
};

export default TalksPage;