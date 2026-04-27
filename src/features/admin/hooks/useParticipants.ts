import { useEffect, useState } from "react";

import { getParticipantsByActiveConference } from "../../../app/api/participantApi.ts";
import type { Participant } from "../types";

export function useParticipants() {
    const [participants, setParticipants] = useState<Participant[]>([]);

    useEffect(() => {
        loadParticipants();
    }, []);

    const loadParticipants = async (): Promise<Participant[]> => {
        try {
            const data = await getParticipantsByActiveConference();

            const normalized = Array.isArray(data)
                ? data.map((participant) => {
                    const registrationDateRaw = participant.createdAt ?? "";
                    const registrationDate = registrationDateRaw
                        ? registrationDateRaw.split("T")[0]
                        : "-";

                    return {
                        id: participant.id,
                        firstName: participant.firstName ?? "",
                        lastName: participant.lastName ?? "",
                        conferenceEntryId: participant.conferenceEntryId,
                        conferenceEntry: participant.conferenceEntry ?? null,
                        isStudent: participant.isStudent,
                        isPresenting: participant.isPresenting ?? false,
                        fileManagers: participant.fileManagers ?? [],
                        email: participant.user?.email ?? "",
                        phone: participant.phone ?? "",
                        affiliation: participant.affiliation ?? "",
                        country: participant.country ?? "",
                        type: participant.isStudent ? "student" : "participant",
                        registrationDate,
                        invoiceStatus: "none" as const,
                    };
                })
                : [];

            setParticipants(normalized);
            return normalized;
        } catch (error) {
            console.error("Failed to load participants", error);
            setParticipants([]);
            return [];
        }
    };

    return {
        participants,
        setParticipants,
        loadParticipants,
    };
}