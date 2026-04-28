import { AlertCircle, Hotel } from "lucide-react";

import type { PublicDashboardContext } from "../../types/publicTypes.ts";

import {
    PublicAlert,
    PublicCard,
} from "../base/index.ts";

import { AccommodationOptionCard } from "./AccommodationOptionCard.tsx";

type AccommodationSectionProps = {
    dashboard: PublicDashboardContext;
};

export function AccommodationSection({
                                         dashboard,
                                     }: AccommodationSectionProps) {
    return (
        <PublicCard
            title="Ubytovanie"
            description="Vyberte si ubytovanie dostupné pre aktívnu konferenciu"
            icon={Hotel}
        >
            {dashboard.accommodationOptions.length > 0 ? (
                <div className="space-y-3">
                    {dashboard.accommodationOptions.map((option) => (
                        <AccommodationOptionCard
                            key={option.id}
                            option={option}
                            dashboard={dashboard}
                        />
                    ))}
                </div>
            ) : (
                <PublicAlert icon={AlertCircle}>
                    Pre túto konferenciu zatiaľ nie sú dostupné žiadne možnosti
                    ubytovania.
                </PublicAlert>
            )}
        </PublicCard>
    );
}