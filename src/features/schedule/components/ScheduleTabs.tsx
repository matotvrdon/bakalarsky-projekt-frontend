import { useEffect, useState } from "react";

import type { ProgramDay } from "../../../api/conferenceApi.ts";

import {
    formatDate,
    sortProgramDays,
} from "../utils/scheduleUtils.ts";

import { ScheduleDayPanel } from "./ScheduleDayPanel.tsx";

type ScheduleTabsProps = {
    programDays: ProgramDay[];
    expandedItems: Record<string, boolean>;
    onToggleExpanded: (key: string) => void;
};

const getDayLabel = (programDay: ProgramDay, index: number) => {
    if (programDay.label?.trim()) {
        return programDay.label;
    }

    const formattedDate = formatDate(programDay.date);

    if (formattedDate) {
        return `Deň ${index + 1} • ${formattedDate}`;
    }

    return `Deň ${index + 1}`;
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

    useEffect(() => {
        if (sortedProgramDays.length === 0) {
            setActiveDayId("");
            return;
        }

        setActiveDayId((currentDayId) => {
            const currentDayStillExists = sortedProgramDays.some(
                (day) => String(day.id) === currentDayId
            );

            if (currentDayStillExists) {
                return currentDayId;
            }

            return String(sortedProgramDays[0].id);
        });
    }, [sortedProgramDays]);

    const activeDay =
        sortedProgramDays.find((day) => String(day.id) === activeDayId) ??
        sortedProgramDays[0];

    return (
        <div className="w-full">
            {sortedProgramDays.length > 1 ? (
                <div className="mb-8 rounded-2xl bg-gray-100 p-2 shadow-sm">
                    <div
                        className="grid gap-2"
                        style={{
                            gridTemplateColumns: `repeat(${sortedProgramDays.length}, minmax(0, 1fr))`,
                        }}
                    >
                        {sortedProgramDays.map((programDay, index) => {
                            const dayId = String(programDay.id);
                            const isActive = dayId === activeDayId;

                            return (
                                <button
                                    key={programDay.id}
                                    type="button"
                                    onClick={() => setActiveDayId(dayId)}
                                    className={[
                                        "flex min-h-[64px] items-center justify-center rounded-xl px-4 py-3 text-center text-sm font-bold transition-all sm:text-base",
                                        isActive
                                            ? "bg-white text-blue-600 shadow-md ring-1 ring-gray-200"
                                            : "text-gray-500 hover:bg-white/70 hover:text-gray-900",
                                    ].join(" ")}
                                >
                                    <span className="hidden sm:inline">
                                        {getDayLabel(programDay, index)}
                                    </span>

                                    <span className="sm:hidden">
                                        {formatDate(programDay.date).slice(0, 5) ||
                                            `D${index + 1}`}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : null}

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