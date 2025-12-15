import { useEffect, useState } from "react";
import type { Conference } from "../../../types/types";
import { getAllConferences } from "../../../api/conferenceApi";
import { downloadProgram } from "../../../api/pdfApi";

const ProgramPage = () => {
    const [conferences, setConferences] = useState<Conference[]>([]);

    useEffect(() => {
        getAllConferences().then(setConferences);
    }, []);

    return (
        <div className="admin-page">
            {/* HEADER */}
            <div className="admin-header">
                <div>
                    <h1>Program</h1>
                    <p className="admin-subtitle">
                        Download conference program (PDF)
                    </p>
                </div>
            </div>

            {/* LIST */}
            {conferences.length === 0 ? (
                <div className="admin-empty">
                    No conferences available
                </div>
            ) : (
                <div className="admin-list">
                    {conferences.map(conf => (
                        <div key={conf.id} className="admin-card">
                            <div>
                                <h3>{conf.name}</h3>
                                <p>
                                    {conf.startDate} → {conf.endDate}
                                </p>
                            </div>

                            <div className="admin-actions">
                                <button
                                    className="admin-btn"
                                    onClick={() =>
                                        downloadProgram(conf.id)
                                    }
                                >
                                    Download program
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProgramPage;