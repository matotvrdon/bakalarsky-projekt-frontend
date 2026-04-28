import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
    createConference,
    deleteConference,
    getAllConferences,
    updateConference,
} from "../../../api/conferenceApi.ts";

import type { Conference } from "../types/adminTypes.ts";

type CreateConferenceInput = {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
};

type UpdateConferenceInput = CreateConferenceInput & {
    isActive: boolean;
};

export function useConferences() {
    const [conferences, setConferences] = useState<Conference[]>([]);

    useEffect(() => {
        loadConferences();
    }, []);

    const loadConferences = async () => {
        try {
            const data = await getAllConferences();

            const normalized = Array.isArray(data)
                ? data.map((conference) => ({
                    ...conference,
                    participantsCount: conference.participantsCount ?? 0,
                }))
                : [];

            setConferences(normalized);
        } catch (error) {
            console.error("Failed to load conferences", error);
            toast.error("Načítanie konferencií zlyhalo.");
        }
    };

    const createConferenceHandler = async (input: CreateConferenceInput) => {
        try {
            await createConference(input);
            toast.success("Konferencia bola vytvorená.");
            await loadConferences();
        } catch (error) {
            console.error("Failed to create conference", error);
            toast.error("Vytvorenie konferencie zlyhalo.");
        }
    };

    const updateConferenceHandler = async (
        id: number,
        input: UpdateConferenceInput
    ) => {
        try {
            await updateConference(id, input);
            toast.success("Konferencia bola upravená.");
            await loadConferences();
        } catch (error) {
            console.error("Failed to update conference", error);
            toast.error("Úprava konferencie zlyhala.");
        }
    };

    const deleteConferenceHandler = async (id: number) => {
        try {
            await deleteConference(id);
            toast.success("Konferencia bola vymazaná.");
            await loadConferences();
        } catch (error) {
            console.error("Failed to delete conference", error);
            toast.error("Vymazanie konferencie zlyhalo.");
        }
    };

    return {
        conferences,
        setConferences,
        loadConferences,
        createConferenceHandler,
        updateConferenceHandler,
        deleteConferenceHandler,
    };
}