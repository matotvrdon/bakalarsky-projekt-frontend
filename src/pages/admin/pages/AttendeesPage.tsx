import { useEffect, useState } from "react";
import styles from "./AttendeesPage.module.css";

import {
    getAttendeesByConference,
    createAttendee,
} from "../../../api/attendeeApi.ts";

import type { Attendee } from "../../../types/types.ts";

const AttendeesPage = () => {
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // form fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const conferenceId = Number(localStorage.getItem("admin.selectedConferenceId"));

    const load = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await getAttendeesByConference(conferenceId);
            setAttendees(data);
        } catch (err: any) {
            setError(err?.message ?? "Failed to load attendees");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleAdd = async () => {
        if (!firstName.trim() || !lastName.trim()) return;

        await createAttendee({
            firstName,
            lastName,
            email,
            phone
        });

        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");

        await load();
    };

    // const handleDelete = async (id: number) => {
    //     await deleteAttendee(id);
    //     await load();
    // };

    return (
        <div className={styles.container}>
            <h1>Attendees</h1>

            {error && <div className={styles.error}>{error}</div>}

            {/* ADD FORM */}
            <div className={styles.formBox}>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />

                <input
                    className={styles.input}
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />

                <input
                    className={styles.input}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className={styles.input}
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                <button className={styles.addBtn} onClick={handleAdd}>
                    Add Attendee
                </button>
            </div>

            {/* LIST */}
            <div className={styles.list}>
                {loading && <p>Loading attendees...</p>}

                {!loading && attendees.length === 0 && (
                    <p>No attendees yet.</p>
                )}

                {attendees.map((a) => (
                    <div key={a.id} className={styles.card}>
                        <div className={styles.name}>
                            {a.firstName} {a.lastName}
                        </div>
                        <div className={styles.field}>Email: {a.email || "-"}</div>
                        <div className={styles.field}>Phone: {a.phone || "-"}</div>

                        {/*<button*/}
                        {/*    className={styles.deleteBtn}*/}
                        {/*    onClick={() => handleDelete(a.id)}*/}
                        {/*>*/}
                        {/*    Delete*/}
                        {/*</button>*/}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AttendeesPage;