import { useEffect, useMemo, useState } from "react";

import type {
    Conference,
    ConferenceEntry,
} from "../../../api/conferenceApi.ts";

type UseParticipantServicesInput = {
    activeConference: Conference | null;
    selectedConferenceEntry: ConferenceEntry | null;
    locked?: boolean;
};

export function useParticipantServices({
                                           activeConference,
                                           selectedConferenceEntry,
                                           locked = false,
                                       }: UseParticipantServicesInput) {
    const [accommodation, setAccommodationState] = useState<number | null>(null);
    const [catering, setCateringState] = useState<number[]>([]);

    const accommodationOptions =
        activeConference?.settings?.bookingOptions ?? [];

    const cateringOptions =
        activeConference?.settings?.foodOptions ?? [];

    const selectedAccommodation =
        accommodationOptions.find((option) => option.id === accommodation) ?? null;

    useEffect(() => {
        if (
            accommodation &&
            !accommodationOptions.some((option) => option.id === accommodation)
        ) {
            setAccommodationState(null);
        }
    }, [accommodation, accommodationOptions]);

    useEffect(() => {
        setCateringState((currentSelections) =>
            currentSelections.filter((id) =>
                cateringOptions.some((option) => option.id === id)
            )
        );
    }, [cateringOptions]);

    const total = useMemo(() => {
        let nextTotal = 0;

        if (selectedConferenceEntry) {
            nextTotal += selectedConferenceEntry.price;
        }

        if (selectedAccommodation) {
            nextTotal += selectedAccommodation.price;
        }

        catering.forEach((id) => {
            const option = cateringOptions.find(
                (cateringOption) => cateringOption.id === id
            );

            if (option) {
                nextTotal += option.price;
            }
        });

        return nextTotal;
    }, [
        selectedConferenceEntry,
        selectedAccommodation,
        catering,
        cateringOptions,
    ]);

    const setAccommodation = (value: number | null) => {
        if (locked) {
            return;
        }

        setAccommodationState(value);
    };

    const setCatering = (value: number[]) => {
        if (locked) {
            return;
        }

        setCateringState(value);
    };

    return {
        accommodation,
        accommodationOptions,
        selectedAccommodation,
        catering,
        cateringOptions,
        total,

        setAccommodation,
        setCatering,
    };
}