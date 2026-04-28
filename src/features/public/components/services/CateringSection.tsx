import { AlertCircle, UtensilsCrossed } from "lucide-react";

import type { PublicDashboardContext } from "../../types/publicTypes.ts";

import {
    PublicAlert,
    PublicCard,
} from "../base/index.ts";

import { CateringOptionCard } from "./CateringOptionCard.tsx";

type CateringSectionProps = {
    dashboard: PublicDashboardContext;
};

export function CateringSection({
                                    dashboard,
                                }: CateringSectionProps) {
    return (
        <PublicCard
            title="Stravovanie"
            description="Vyberte si stravovanie počas konferencie"
            icon={UtensilsCrossed}
        >
            {dashboard.cateringOptions.length > 0 ? (
                <div className="space-y-3">
                    {dashboard.cateringOptions.map((option) => (
                        <CateringOptionCard
                            key={option.id}
                            option={option}
                            dashboard={dashboard}
                        />
                    ))}
                </div>
            ) : (
                <PublicAlert icon={AlertCircle}>
                    Pre túto konferenciu zatiaľ nie sú dostupné žiadne možnosti
                    stravovania.
                </PublicAlert>
            )}
        </PublicCard>
    );
}