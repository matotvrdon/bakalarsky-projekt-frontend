import { useEffect, useState } from "react";

import {
    getActiveConference,
    type Conference,
} from "../../../app/api/conferenceApi.ts";

type ActiveConferenceResponse = Conference | Conference[] | null;

const normalizeActiveConference = (
    response: ActiveConferenceResponse
): Conference | null => {
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
        useState<Conference | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadActiveConference = async () => {
            try {
                const response =
                    (await getActiveConference()) as ActiveConferenceResponse;

                if (!isMounted) {
                    return;
                }

                setActiveConference(normalizeActiveConference(response));
            } catch (error) {
                console.error("Failed to load active conference", error);

                if (!isMounted) {
                    return;
                }

                setActiveConference(null);
            }
        };

        loadActiveConference();

        return () => {
            isMounted = false;
        };
    }, []);

    return activeConference;
}