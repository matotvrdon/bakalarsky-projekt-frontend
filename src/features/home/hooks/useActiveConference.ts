import { useEffect, useState } from "react";

import {
    getActiveConference,
    type ConferenceSettings,
} from "../../../app/api/conferenceApi.ts";

export type ActiveConference = {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    isActive: boolean;
    participantsCount?: number;
    settings?: ConferenceSettings | null;
};

const normalizeActiveConferenceResponse = (
    response: ActiveConference | ActiveConference[] | null | undefined
): ActiveConference | null => {
    if (!response) {
        return null;
    }

    if (Array.isArray(response)) {
        return response[0] ?? null;
    }

    return response;
};

export function useActiveConference() {
    const [activeConference, setActiveConference] =
        useState<ActiveConference | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        let isMounted = true;

        const loadActiveConference = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getActiveConference();
                const normalizedConference =
                    normalizeActiveConferenceResponse(response);

                console.log("ACTIVE CONFERENCE RAW:", response);
                console.log("ACTIVE CONFERENCE NORMALIZED:", normalizedConference);

                if (!isMounted) {
                    return;
                }

                setActiveConference(normalizedConference);
            } catch (loadError) {
                if (!isMounted) {
                    return;
                }

                console.error("Failed to load active conference", loadError);
                setError(loadError);
                setActiveConference(null);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadActiveConference();

        return () => {
            isMounted = false;
        };
    }, []);

    return {
        activeConference,
        loading,
        error,
    };
}