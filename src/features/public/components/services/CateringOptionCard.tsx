import type { FoodOption } from "../../../../api/conferenceApi.ts";
import type { PublicDashboardContext } from "../../types/publicTypes.ts";

import {
    formatDate,
    getFoodTypeLabel,
} from "../../utils/publicUtils.ts";

import {
    PublicBadge,
    PublicOptionCard,
} from "../base/index.ts";

type CateringOptionCardProps = {
    option: FoodOption;
    dashboard: PublicDashboardContext;
};

export function CateringOptionCard({
                                       option,
                                       dashboard,
                                   }: CateringOptionCardProps) {
    const id = `catering-${option.id}`;
    const selected = dashboard.catering.includes(option.id);
    const locked = dashboard.invoiceGenerated;

    const toggleSelection = (checked: boolean) => {
        if (locked) {
            return;
        }

        if (checked) {
            dashboard.setCatering([
                ...dashboard.catering,
                option.id,
            ]);

            return;
        }

        dashboard.setCatering(
            dashboard.catering.filter((itemId) => itemId !== option.id)
        );
    };

    return (
        <PublicOptionCard
            htmlFor={id}
            selected={selected}
            disabled={locked}
        >
            <input
                id={id}
                type="checkbox"
                checked={selected}
                disabled={locked}
                onChange={(event) => toggleSelection(event.target.checked)}
                className="mt-1 h-4 w-4"
            />

            <div className="flex-1">
                <div className="font-semibold text-gray-900">
                    {option.name}
                </div>

                {option.description ? (
                    <p className="mt-1 text-sm text-gray-600">
                        {option.description}
                    </p>
                ) : null}

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <span>
                        {getFoodTypeLabel(option.foodOptionsType)}
                    </span>

                    <span>•</span>

                    <span>
                        {formatDate(option.date)}
                    </span>
                </div>
            </div>

            <PublicBadge>
                {option.price} €
            </PublicBadge>
        </PublicOptionCard>
    );
}