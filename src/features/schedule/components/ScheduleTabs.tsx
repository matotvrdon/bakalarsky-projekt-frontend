import { useState } from "react";

import type { ProgramDay } from "../../../app/api/conferenceApi.ts";

import {
    formatDate,
    formatDayTab,
    sortProgramDays,
} from "../utils/scheduleUtils.ts";

import { ScheduleDayPanel } from "./ScheduleDayPanel.tsx";

type ScheduleTabsProps = {
    programDays: ProgramDay[];
    expandedItems: Record<string, boolean>;
    onToggleExpanded: (key: string) => void;
};

export function ScheduleTabs({
                                 programDays,
                                 expandedItems,
                                 onToggleExpanded,
                             }: ScheduleTabsProps) {
    const sortedProgramDays = sortProgramDays(programDays);
    const [activeDayId, setActiveDayId] = useState(
        String(sortedProgramDays[0]?.id ?? "")
    );

    const activeDay =
        sortedProgramDays.find((day) => String(day.id) === activeDayId) ??
        sortedProgramDays[0];

    return (
        <div className="w-full">
            <div
                className="mb-8 grid w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                style={{
                    gridTemplateColumns: `repeat(${sortedProgramDays.length}, minmax(0, 1fr))`,
                }}
            >
                {sortedProgramDays.map((programDay) => {
                    const isActive = String(programDay.id) === activeDayId;

                    return (
                        <button
                            key={programDay.id}
                            type="button"
                            onClick={() => setActiveDayId(String(programDay.id))}
                            className={[
                                "px-3 py-3 text-xs font-semibold transition sm:text-sm",
                                isActive
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-50",
                            ].join(" ")}
                        >
                            <span className="hidden sm:inline">
                                {programDay.label || formatDayTab(programDay.date)}
                            </span>

                            <span className="sm:hidden">
                                {formatDate(programDay.date).slice(0, 5)}
                            </span>
                        </button>
                    );
                })}
            </div>

            {activeDay ? (
                <ScheduleDayPanel
                    programDay={activeDay}
                    expandedItems={expandedItems}
                    onToggleExpanded={onToggleExpanded}
                />
            ) : null}
        </div>
    );
}