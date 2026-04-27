import { AlertCircle, Hotel, UtensilsCrossed } from "lucide-react";

import type { PublicDashboardContext } from "../../types/publicTypes.ts";

import {
    formatDate,
    formatDateRange,
    getFoodTypeLabel,
} from "../../utils/publicUtils.ts";

import {
    PublicAlert,
    PublicBadge,
    PublicCard,
    PublicOptionCard,
} from "../base/index.ts";

type ServicesTabProps = {
    dashboard: PublicDashboardContext;
};

export function ServicesTab({ dashboard }: ServicesTabProps) {
    return (
        <div className="space-y-6">
            <PublicCard
                title="Ubytovanie"
                description="Vyberte si ubytovanie dostupné pre aktívnu konferenciu"
                icon={Hotel}
            >
                {dashboard.accommodationOptions.length > 0 ? (
                    <div className="space-y-3">
                        {dashboard.accommodationOptions.map((option) => {
                            const id = `accom-${option.id}`;
                            const selected = dashboard.accommodation === option.id;

                            return (
                                <PublicOptionCard
                                    key={option.id}
                                    htmlFor={id}
                                    selected={selected}
                                >
                                    <input
                                        id={id}
                                        type="radio"
                                        name="accommodation"
                                        value={option.id}
                                        checked={selected}
                                        onChange={() =>
                                            dashboard.setAccommodation(option.id)
                                        }
                                        className="mt-1 h-4 w-4"
                                    />

                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">
                                            {option.name}
                                        </div>

                                        <p className="mt-1 text-sm text-gray-600">
                                            {option.description}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            {formatDateRange(
                                                option.startDate,
                                                option.endDate
                                            )}
                                        </p>
                                    </div>

                                    <PublicBadge>
                                        {option.price} €
                                    </PublicBadge>
                                </PublicOptionCard>
                            );
                        })}
                    </div>
                ) : (
                    <PublicAlert icon={AlertCircle}>
                        Pre túto konferenciu zatiaľ nie sú dostupné žiadne možnosti
                        ubytovania.
                    </PublicAlert>
                )}
            </PublicCard>

            <PublicCard
                title="Stravovanie"
                description="Vyberte si stravovanie počas konferencie"
                icon={UtensilsCrossed}
            >
                {dashboard.cateringOptions.length > 0 ? (
                    <div className="space-y-3">
                        {dashboard.cateringOptions.map((option) => {
                            const id = `catering-${option.id}`;
                            const selected = dashboard.catering.includes(option.id);

                            return (
                                <PublicOptionCard
                                    key={option.id}
                                    htmlFor={id}
                                    selected={selected}
                                >
                                    <input
                                        id={id}
                                        type="checkbox"
                                        checked={selected}
                                        onChange={(event) => {
                                            if (event.target.checked) {
                                                dashboard.setCatering([
                                                    ...dashboard.catering,
                                                    option.id,
                                                ]);
                                            } else {
                                                dashboard.setCatering(
                                                    dashboard.catering.filter(
                                                        (itemId) => itemId !== option.id
                                                    )
                                                );
                                            }
                                        }}
                                        className="mt-1 h-4 w-4"
                                    />

                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">
                                            {option.name}
                                        </div>

                                        <p className="mt-1 text-sm text-gray-600">
                                            {option.description}
                                        </p>

                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                            <span>
                                                {getFoodTypeLabel(
                                                    option.foodOptionsType
                                                )}
                                            </span>
                                            <span>•</span>
                                            <span>{formatDate(option.date)}</span>
                                        </div>
                                    </div>

                                    <PublicBadge>
                                        {option.price} €
                                    </PublicBadge>
                                </PublicOptionCard>
                            );
                        })}
                    </div>
                ) : (
                    <PublicAlert icon={AlertCircle}>
                        Pre túto konferenciu zatiaľ nie sú dostupné žiadne možnosti
                        stravovania.
                    </PublicAlert>
                )}
            </PublicCard>
        </div>
    );
}