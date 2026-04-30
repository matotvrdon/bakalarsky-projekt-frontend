import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import {
    getActiveConferences,
    type Conference,
} from "../../../api/conferenceApi.ts";

type UseConferenceSelectionState = {
    conferences: Conference[];
    loading: boolean;
    error: string | null;
};

export function useConferenceSelection() {
    const navigate = useNavigate();

    const [state, setState] = useState<UseConferenceSelectionState>({
        conferences: [],
        loading: true,
        error: null,
    });

    useEffect(() => {
        let isMounted = true;

        const loadConferences = async () => {
            try {
                setState({
                    conferences: [],
                    loading: true,
                    error: null,
                });

                const conferences = await getActiveConferences();

                if (!isMounted) {
                    return;
                }

                if (conferences.length === 1) {
                    navigate(`/conference/${conferences[0].id}`, {
                        replace: true,
                    });

                    return;
                }

                setState({
                    conferences,
                    loading: false,
                    error: null,
                });
            } catch (error) {
                console.error("Failed to load active conferences", error);

                if (!isMounted) {
                    return;
                }

                setState({
                    conferences: [],
                    loading: false,
                    error: "Konferencie sa nepodarilo načítať.",
                });
            }
        };

        loadConferences();

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    return state;
}