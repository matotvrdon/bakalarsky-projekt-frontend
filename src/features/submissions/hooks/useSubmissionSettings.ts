import { useEffect, useState } from "react";

import { getActiveSubmissionSettings } from "../../../api/submissionSettingsApi.ts";
import type { SubmissionSettings } from "../types/submissionSettingsTypes.ts";

type UseSubmissionSettingsState = {
    data: SubmissionSettings | null;
    loading: boolean;
    error: string | null;
};

export function useSubmissionSettings() {
    const [state, setState] = useState<UseSubmissionSettingsState>({
        data: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        let isMounted = true;

        const loadSettings = async () => {
            try {
                const data = await getActiveSubmissionSettings();

                if (!isMounted) {
                    return;
                }

                setState({
                    data,
                    loading: false,
                    error: null,
                });
            } catch (error) {
                console.error("Failed to load submission settings", error);

                if (!isMounted) {
                    return;
                }

                setState({
                    data: null,
                    loading: false,
                    error: "Nastavenia príspevkov sa nepodarilo načítať.",
                });
            }
        };

        loadSettings();

        return () => {
            isMounted = false;
        };
    }, []);

    return state;
}