import { useEffect, useState } from "react";
import type { Day, Conference } from "../../../types/types";
import { getDaysByConference, createDay, deleteDay } from "../../../api/dayApi";
import { getConferenceById } from "../../../api/conferenceApi";

const DaysPage = () => {
    const conferenceId = Number(
        localStorage.getItem("admin.selectedConferenceId")
    );

    const [conference, setConference] = useState<Conference | null>(null);
    const [days, setDays] = useState<Day[]>([]);
    const [date, setDate] = useState("");

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
        if (!date) return;

        await createDay({
            date,
            conferenceId
        });

        setDate("");
        load();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete day?")) return;
        await deleteDay(id);
        load();
    };

    if (!conferenceId || !conference) {
        return (
            <div className="admin-page">
                <div className="admin-empty">
                    No conference selected
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            {/* HEADER */}
            <div className="admin-header">
                <div>
                    <h1>Days</h1>
                    <p className="admin-subtitle">
                        Conference: <strong>{conference.name}</strong><br />
                        {conference.startDate} → {conference.endDate}
                    </p>
                </div>
            </div>

            {/* CREATE */}
            <div className="admin-create">
                <h2>Add day</h2>

                <div
                    className="admin-form"
                    style={{ gridTemplateColumns: "1fr auto" }}
                >
                    <div className="admin-field">
                        <label className="admin-label">Date</label>
                        <input
                            type="date"
                            className="admin-input"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                        />
                    </div>

                    <button className="admin-btn" onClick={handleCreate}>
                        Add
                    </button>
                </div>
            </div>

            {/* LIST */}
            {days.length === 0 ? (
                <div className="admin-empty">
                    No days created for this conference
                </div>
            ) : (
                <div className="admin-list">
                    {days.map(d => (
                        <div key={d.id} className="admin-card">
                            <div>
                                <h3>{d.date}</h3>
                            </div>

                            <div className="admin-actions">
                                <button
                                    className="admin-btn danger"
                                    onClick={() => handleDelete(d.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DaysPage;