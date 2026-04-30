import { Link } from "react-router";
import { CalendarDays, MapPin } from "lucide-react";

import type { Conference } from "../../../api/conferenceApi.ts";

type ConferenceSelectionCardProps = {
    conference: Conference;
};

const formatDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate || !endDate) {
        return "Dátum nie je nastavený";
    }

    return `${startDate} - ${endDate}`;
};

export function ConferenceSelectionCard({
                                            conference,
                                        }: ConferenceSelectionCardProps) {
    return (
        <Link
            to={`/conference/${conference.id}`}
            className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
        >
            <div className="flex h-full flex-col">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600">
                        {conference.name}
                    </h2>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                        {conference.description}
                    </p>

                    <div className="mt-5 space-y-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-blue-600" />
                            <span>
                                {formatDateRange(conference.startDate, conference.endDate)}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-600" />
                            <span>
                                {conference.location || "Miesto nie je nastavené"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <span className="inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                        Pokračovať
                    </span>
                </div>
            </div>
        </Link>
    );
}