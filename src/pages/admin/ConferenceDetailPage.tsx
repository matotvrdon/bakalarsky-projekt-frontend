import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Conference } from "../../types/types.ts";
import { getConferenceById } from "../../api/conferenceApi.ts";
import {
    AdminPage,
    AdminHeader,
    AdminButton,
    StatsGrid,
    StatCard
} from "../../components/admin/ui";

const ConferenceDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [conference, setConference] = useState<Conference | null>(null);

    useEffect(() => {
        if (id) getConferenceById(Number(id)).then(setConference);
    }, [id]);

    if (!conference) return <p>Loading…</p>;

    const days = conference.day ?? [];
    const sessions = days.flatMap((d) => d?.session ?? []).filter(Boolean);
    const themes = sessions.flatMap((s) => s?.theme ?? []).filter(Boolean);
    const talks = themes.flatMap((t) => t?.talk ?? []).filter(Boolean);

    return (
        <AdminPage>
            <AdminHeader
                title={conference.name}
                subtitle={`${conference.startDate} → ${conference.endDate}`}
            />

            <StatsGrid>
                <StatCard label="Days" value={days.length} />
                <StatCard label="Sessions" value={sessions.length} />
                <StatCard label="Themes" value={themes.length} />
                <StatCard label="Talks" value={talks.length} />
            </StatsGrid>

            <div className="admin-actions">
                <AdminButton onClick={() => navigate(`/admin/conference/${id}/days`)}>
                    Manage Days
                </AdminButton>
                <AdminButton onClick={() => navigate(`/admin/conference/${id}/sessions`)}>
                    Manage Sessions
                </AdminButton>
                <AdminButton onClick={() => navigate(`/admin/conference/${id}/themes`)}>
                    Manage Themes
                </AdminButton>
                <AdminButton onClick={() => navigate(`/admin/conference/${id}/talks`)}>
                    Manage Talks
                </AdminButton>
                <AdminButton onClick={() => navigate(`/admin/conference/${id}/attendees`)}>
                    Manage Attendees
                </AdminButton>
                <AdminButton onClick={() => navigate(`/admin/conference/${id}/invoices`)}>
                    Manage Invoices
                </AdminButton>
            </div>
        </AdminPage>
    );
};

export default ConferenceDetailPage;