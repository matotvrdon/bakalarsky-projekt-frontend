import type { Conference } from "../../../api/conferenceApi.ts";
import { ConferenceSelectionCard } from "./ConferenceSelectionCard.tsx";

type ConferenceSelectionListProps = {
    conferences: Conference[];
};

export function ConferenceSelectionList({
                                            conferences,
                                        }: ConferenceSelectionListProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            {conferences.map((conference) => (
                <ConferenceSelectionCard
                    key={conference.id}
                    conference={conference}
                />
            ))}
        </div>
    );
}