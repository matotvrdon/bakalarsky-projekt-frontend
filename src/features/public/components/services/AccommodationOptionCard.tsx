import type { BookingOption } from "../../../../api/conferenceApi.ts";
import type { PublicDashboardContext } from "../../types/publicTypes.ts";

import { formatDateRange } from "../../utils/publicUtils.ts";

import {
    PublicBadge,
    PublicOptionCard,
} from "../base/index.ts";

type AccommodationOptionCardProps = {
    option: BookingOption;
    dashboard: PublicDashboardContext;
};

export function AccommodationOptionCard({
                                            option,
                                            dashboard,
                                        }: AccommodationOptionCardProps) {
    const id = `accom-${option.id}`;
    const selected = dashboard.accommodation === option.id;
    const locked = dashboard.invoiceGenerated;

    return (
        <PublicOptionCard
            htmlFor={id}
            selected={selected}
            disabled={locked}
        >
            <input
                id={id}
                type="radio"
                name="accommodation"
                value={option.id}
                checked={selected}
                disabled={locked}
                onChange={() => dashboard.setAccommodation(option.id)}
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

                <p className="mt-1 text-xs text-gray-500">
                    {formatDateRange(option.startDate, option.endDate)}
                </p>
            </div>

            <PublicBadge>
                {option.price} €
            </PublicBadge>
        </PublicOptionCard>
    );
}