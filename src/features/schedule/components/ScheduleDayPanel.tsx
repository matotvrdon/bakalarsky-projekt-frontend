import type { ProgramDay } from "../../../app/api/conferenceApi.ts";

import { sortProgramItems } from "../utils/scheduleUtils.ts";

import { ScheduleItemCard } from "./ScheduleItemCard.tsx";

type ScheduleDayPanelProps = {
    programDay: ProgramDay;
    expandedItems: Record<string, boolean>;
    onToggleExpanded: (key: string) => void;
};

export function ScheduleDayPanel({
                                     programDay,
                                     expandedItems,
                                     onToggleExpanded,
                                 }: ScheduleDayPanelProps) {
    const items = sortProgramItems(programDay.programItems);

    return (
        <div className="space-y-4">
            {items.map((item) => (
                <ScheduleItemCard
                    key={item.id}
                    item={item}
                    dayKey={String(programDay.id)}
                    expandedItems={expandedItems}
                    onToggleExpanded={onToggleExpanded}
                />
            ))}
        </div>
    );
}