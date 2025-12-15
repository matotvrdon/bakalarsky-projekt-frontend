import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Conference } from "../../../types/types";
import {
    getAllConferences,
    createConference,
    deleteConference
} from "../../../api/conferenceApi";

const ConferencesPage = () => {
    const [conferences, setConferences] = useState<Conference[]>([]);
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        const data = await getAllConferences();
        setConferences(data);
    };

    const handleCreate = async () => {
        if (!name || !startDate || !endDate) return;

        await createConference({
            name,
            startDate,
            endDate
        });

        setName("");
        setStartDate("");
        setEndDate("");
        load();
    };

    const handleManage = (id: number) => {
        localStorage.setItem("admin.selectedConferenceId", id.toString());
        navigate(`/admin/conference/${id}`);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete conference?")) return;
        await deleteConference(id);
        load();
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Conferences</h1>
            </div>

            {/* CREATE */}
            <div className="admin-create">
                <h2>Create new conference</h2>

                <div className="admin-form">
                    <div className="admin-field">
                        <label className="admin-label">Name</label>
                        <input
                            className="admin-input"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Conference name"
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">Start date</label>
                        <input
                            type="date"
                            className="admin-input"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                        />
                    </div>

                    <div className="admin-field">
                        <label className="admin-label">End date</label>
                        <input
                            type="date"
                            className="admin-input"
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                        />
                    </div>

                    <button className="admin-btn" onClick={handleCreate}>
                        Create
                    </button>
                </div>
            </div>

            {/* LIST */}
            {conferences.length === 0 ? (
                <div className="admin-empty">
                    No conferences created yet
                </div>
            ) : (
                <div className="admin-list">
                    {conferences.map(c => (
                        <div key={c.id} className="admin-card">
                            <div>
                                <h3>{c.name}</h3>
                                <p>
                                    {c.startDate} → {c.endDate}
                                </p>
                            </div>

                            <div className="admin-actions">
                                <button
                                    className="admin-btn secondary"
                                    onClick={() => handleManage(c.id)}
                                >
                                    Manage
                                </button>

                                <button
                                    className="admin-btn danger"
                                    onClick={() => handleDelete(c.id)}
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

export default ConferencesPage;