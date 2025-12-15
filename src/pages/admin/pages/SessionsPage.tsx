import { useEffect, useState } from "react";
import type { Conference, Day } from "../../../types/types";
import { getConferenceById } from "../../../api/conferenceApi";
import { getDaysByConference } from "../../../api/dayApi";
import { createSession, deleteSession } from "../../../api/sessionApi";

const SessionsPage = () => {
    const conferenceId = Number(
        localStorage.getItem("admin.selectedConferenceId")
    );

    const [conference, setConference] = useState<Conference | null>(null);
    const [days, setDays] = useState<Day[]>([]);
    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [selectedDayId, setSelectedDayId] = useState<number | null>(null);

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

    const handleCreate = async () => {
        if (!title || !startTime || !endTime || !selectedDayId) return;

        await createSession({
            title,
            startTime,
            endTime,
            dayId: selectedDayId
        });

        setTitle("");
        setStartTime("");
        setEndTime("");
        setSelectedDayId(null);
        load();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete session?")) return;
        await deleteSession(id);
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
                    <h1>Sessions</h1>
                    <p className="admin-subtitle">
                        Conference: <strong>{conference.name}</strong><br />
                        {conference.startDate} → {conference.endDate}
                    </p>
                </div>
            </div>

            {/* CREATE */}
            <div className="admin-create">
                <h2>Add session</h2>

                <div className="admin-form">
                    <div className="admin-field">
                        <label className="admin-label">Title</label>
                        <input
                            className="admin-input"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Session title"
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Day</label>
                        <select
                            className="admin-input"
                            value={selectedDayId ?? ""}
                            onChange={e =>
                                setSelectedDayId(Number(e.target.value))
                            }
                        >
                            <option value="">Select day</option>
                            {days.map(d => (
                                <option key={d.id} value={d.id}>
                                    {d.date}
                                </option>
                            ))}
                        </select>
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
                        <h3 style={{ marginBottom: 12 }}>
                            {day.date}
                        </h3>

                        {day.session.length === 0 ? (
                            <div className="admin-empty">
                                No sessions for this day
                            </div>
                        ) : (
                            <div className="admin-list">
                                {day.session.map(s => (
                                    <div key={s.id} className="admin-card">
                                        <div>
                                            <h3>{s.title}</h3>
                                            <p>
                                                {s.startTime} – {s.endTime}
                                            </p>
                                        </div>

                                        <div className="admin-actions">
                                            <button
                                                className="admin-btn danger"
                                                onClick={() =>
                                                    handleDelete(s?.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                ))
            )}
        </div>
    );
};

export default SessionsPage;