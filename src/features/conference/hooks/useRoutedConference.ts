import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router";

import {
    getActiveConference,
    getConferencePreviewById,
    getPublicConferenceById,
    type Conference,
} from "../../../api/conferenceApi.ts";

type ConferenceResponse = Conference | Conference[] | null;

const normalizeConferenceResponse = (
    response: ConferenceResponse
): Conference | null => {
    if (!response) {
        return null;
    }

    if (Array.isArray(response)) {
        return response[0] ?? null;
    }

    return response;
};

export function useRoutedConference() {
    const location = useLocation();
    const params = useParams();

    const [conference, setConference] = useState<Conference | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    const conferenceId = useMemo(() => {
        const value = Number(params.conferenceId);

        return Number.isFinite(value) && value > 0 ? value : null;
    }, [params.conferenceId]);

    const isPreview = location.pathname.startsWith("/admin/conferences/");

    useEffect(() => {
        let isMounted = true;

        const loadConference = async () => {
            try {
                setLoading(true);
                setError(null);

                let response: ConferenceResponse;

                if (conferenceId && isPreview) {
                    response = await getConferencePreviewById(conferenceId);
                } else if (conferenceId) {
                    response = await getPublicConferenceById(conferenceId);
                } else {
                    response = await getActiveConference() as ConferenceResponse;
                }

                if (!isMounted) {
                    return;
                }

                setConference(normalizeConferenceResponse(response));
            } catch (loadError) {
                console.error("Failed to load routed conference", loadError);

                if (!isMounted) {
                    return;
                }

                setConference(null);
                setError(loadError);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadConference();

        return () => {
            isMounted = false;
        };
    }, [conferenceId, isPreview]);

    return {
        conference,
        loading,
        error,
        conferenceId,
        isPreview,
    };
}