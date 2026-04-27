import { useEffect, useState } from "react";

import {
    getActiveCommittees,
    type ConferenceCommittees,
} from "../../../app/api/committeeApi.ts";

type UseCommitteesState = {
    data: ConferenceCommittees | null;
    loading: boolean;
    error: string | null;
};

export function useCommittees() {
    const [state, setState] = useState<UseCommitteesState>({
        data: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        let isMounted = true;

        const loadCommittees = async () => {
            try {
                setState({
                    data: null,
                    loading: true,
                    error: null,
                });

                const result = await getActiveCommittees();

                if (!isMounted) {
                    return;
                }

                setState({
                    data: result,
                    loading: false,
                    error: null,
                });
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                console.error("Failed to load committees", error);

                setState({
                    data: null,
                    loading: false,
                    error: "Komisie sa nepodarilo načítať.",
                });
            }
        };

        loadCommittees();

        return () => {
            isMounted = false;
        };
    }, []);

    return state;
}