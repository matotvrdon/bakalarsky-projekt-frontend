import { Clock, MapPin, User, Users } from "lucide-react";

import type { ProgramItem } from "../../../api/conferenceApi.ts";

import {
    formatTimeRange,
    getProgramItemClassName,
    sortSessions,
} from "../utils/scheduleUtils.ts";

import { SessionDetailTable } from "./SessionDetailTable.tsx";

type ScheduleItemCardProps = {
    item: ProgramItem;
    dayKey: string;
    expandedItems: Record<string, boolean>;
    onToggleExpanded: (key: string) => void;
};

export function ScheduleItemCard({
                                     item,
                                     dayKey,
                                     expandedItems,
                                     onToggleExpanded,
                                 }: ScheduleItemCardProps) {
    const itemKey = `${dayKey}-${item.id}`;
    const isExpanded = expandedItems[itemKey];
    const sessions = sortSessions(item.sessions);

    return (
        <article
            className={[
                "rounded-2xl border border-gray-200 border-l-4 p-6 shadow-sm",
                getProgramItemClassName(item.type),
            ].join(" ")}
        >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4 shrink-0" />

                    <span className="font-semibold">
                        {formatTimeRange(item.startTime, item.endTime)}
                    </span>
                </div>

                <div className="md:col-span-2">
                    <h3 className="mb-1 font-bold text-gray-900">
                        {item.title}
                    </h3>

                    {item.speaker ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="h-4 w-4" />
                            <span>{item.speaker}</span>
                        </div>
                    ) : null}

                    {item.chair && sessions.length === 0 ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>Chair: {item.chair}</span>
                        </div>
                    ) : null}
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                    {item.location ? (
                        <>
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">
                                {item.location}
                            </span>
                        </>
                    ) : null}
                </div>
            </div>

            {sessions.length > 0 ? (
                <div className="mt-6">
                    <button
                        type="button"
                        onClick={() => onToggleExpanded(itemKey)}
                        className="mb-4 flex items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-800"
                    >
                        {isExpanded ? "Skryť detail" : "Zobraziť detail"}

                        <span className="text-xs">
                            ({sessions.length}{" "}
                            {sessions.length === 1 ? "session" : "sessions"})
                        </span>
                    </button>

                    {isExpanded ? (
                        <div className="space-y-6">
                            {sessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="border-t border-gray-200 pt-4"
                                >
                                    <h4 className="mb-2 text-lg font-bold text-gray-900">
                                        {session.sessionName}
                                    </h4>

                                    <SessionDetailTable session={session} />
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>
            ) : null}
        </article>
    );
}