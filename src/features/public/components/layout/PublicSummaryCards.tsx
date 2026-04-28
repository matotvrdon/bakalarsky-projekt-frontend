import {
    PublicCard,
} from "../base";

import type { PublicSummary } from "../../types/publicTypes.ts";

type PublicSummaryCardsProps = {
    summary: PublicSummary;
};

export function PublicSummaryCards({ summary }: PublicSummaryCardsProps) {
    const cards = [
        {
            title: "Účasť",
            value: summary.conferenceEntryLabel,
        },
        {
            title: "Študent",
            value: summary.studentStatusLabel,
        },
        {
            title: "Príspevok",
            value: summary.submissionStatusLabel,
        },
    ];

    return (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {cards.map((card) => (
                <PublicCard key={card.title} className="p-0">
                    <div className="p-5">
                        <p className="text-sm font-medium text-gray-600">
                            {card.title}
                        </p>

                        <p className="mt-2 text-base font-semibold text-gray-900">
                            {card.value}
                        </p>
                    </div>
                </PublicCard>
            ))}
        </div>
    );
}