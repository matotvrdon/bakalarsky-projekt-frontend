import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import styles from "./ConferenceDetailPage.module.css";

import { getConferenceById } from "../../../api/conferenceApi.ts";

import type { Conference } from "../../../types/types.ts";

const ConferenceDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [conference, setConference] = useState<Conference | null>(null);

    const load = async () => {
        if (!id) return;
        const data = await getConferenceById(Number(id));
        setConference(data);
    };

    useEffect(() => {
        load();
    }, [id]);

    if (!conference) return <p>Loading…</p>;

    // --- Counters ---
    const days = conference.day ?? [];

    const sessions = days
        .flatMap((d) => d?.session ?? [])
        .filter(Boolean);

    const themes = sessions
        .flatMap((s) => s?.theme ?? [])
        .filter(Boolean);

    const talks = themes
        .flatMap((t) => t?.talk ?? [])
        .filter(Boolean);

    return (
        <div className={styles.container}>
            <h1>{conference.name}</h1>

            <p className={styles.dates}>
                {conference.startDate.slice(0, 10)} → {conference.endDate.slice(0, 10)}
            </p>

            {/* STATISTICS */}
            <div className={styles.stats}>
                <div className={styles.statBox}>Days: {days.length}</div>
                <div className={styles.statBox}>Sessions: {sessions.length}</div>
                <div className={styles.statBox}>Themes: {themes.length}</div>
                <div className={styles.statBox}>Talks: {talks.length}</div>
            </div>

            {/* NAVIGATION BUTTONS */}
            <div className={styles.actions}>
                <button onClick={() => navigate(`/admin/conference/${id}/days`)}>
                    Manage Days
                </button>

                <button onClick={() => navigate(`/admin/conference/${id}/sessions`)}>
                    Manage Sessions
                </button>

                <button onClick={() => navigate(`/admin/conference/${id}/themes`)}>
                    Manage Themes
                </button>

                <button onClick={() => navigate(`/admin/conference/${id}/talks`)}>
                    Manage Talks
                </button>

                <button onClick={() => navigate(`/admin/conference/${id}/attendees`)}>
                    Manage Attendees
                </button>

                <button onClick={() => navigate(`/admin/conference/${id}/invoices`)}>
                    Manage Invoices
                </button>
            </div>
        </div>
    );
};

export default ConferenceDetailPage;