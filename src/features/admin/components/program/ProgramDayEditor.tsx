import { Plus, Trash2 } from "lucide-react";

import type {
    ProgramDayForm,
    ProgramItemForm,
    ProgramItemType,
    ProgramPresentationForm,
    ProgramSessionForm,
} from "../../types/adminTypes.ts";

import {
    AdminButton,
    AdminInput,
} from "../base/index.ts";

import {
    AdminCollapsiblePanel,
    AdminFormField,
    AdminIconButton,
} from "../shared/index.ts";

import { ProgramItemEditor } from "./ProgramItemEditor.tsx";

type ProgramDayEditorProps = {
    day: ProgramDayForm;
    dayIndex: number;
    expanded: Record<string, boolean>;
    onToggleExpanded: (key: string) => void;
    onUpdateDay: (
        dayIndex: number,
        field: keyof Omit<ProgramDayForm, "clientId" | "items">,
        value: string
    ) => void;
    onRemoveDay: (dayIndex: number) => void;
    onAddItem: (dayIndex: number) => void;
    onUpdateItem: (
        dayIndex: number,
        itemIndex: number,
        field: keyof Omit<ProgramItemForm, "clientId" | "sessions">,
        value: string | ProgramItemType
    ) => void;
    onRemoveItem: (dayIndex: number, itemIndex: number) => void;
    onAddSession: (dayIndex: number, itemIndex: number) => void;
    onUpdateSession: (
        dayIndex: number,
        itemIndex: number,
        sessionIndex: number,
        field: keyof Omit<ProgramSessionForm, "clientId" | "presentations">,
        value: string
    ) => void;
    onRemoveSession: (
        dayIndex: number,
        itemIndex: number,
        sessionIndex: number
    ) => void;
    onAddPresentation: (
        dayIndex: number,
        itemIndex: number,
        sessionIndex: number
    ) => void;
    onUpdatePresentation: (
        dayIndex: number,
        itemIndex: number,
        sessionIndex: number,
        presentationIndex: number,
        field: keyof Omit<ProgramPresentationForm, "clientId">,
        value: string
    ) => void;
    onRemovePresentation: (
        dayIndex: number,
        itemIndex: number,
        sessionIndex: number,
        presentationIndex: number
    ) => void;
};

export function ProgramDayEditor({
                                     day,
                                     dayIndex,
                                     expanded,
                                     onToggleExpanded,
                                     onUpdateDay,
                                     onRemoveDay,
                                     onAddItem,
                                     onUpdateItem,
                                     onRemoveItem,
                                     onAddSession,
                                     onUpdateSession,
                                     onRemoveSession,
                                     onAddPresentation,
                                     onUpdatePresentation,
                                     onRemovePresentation,
                                 }: ProgramDayEditorProps) {
    const dayExpandedKey = `day-${day.clientId}`;
    const isDayExpanded = expanded[dayExpandedKey] ?? true;

    return (
        <AdminCollapsiblePanel
            title={day.label || `Deň ${dayIndex + 1}`}
            subtitle={day.date || "Dátum nie je zadaný"}
            expanded={isDayExpanded}
            onToggle={() => onToggleExpanded(dayExpandedKey)}
            actions={
                <>
                    <AdminButton
                        variant="outline"
                        size="sm"
                        onClick={() => onAddItem(dayIndex)}
                        icon={<Plus className="h-4 w-4" />}
                    >
                        Položka
                    </AdminButton>

                    <AdminIconButton
                        icon={Trash2}
                        label="Odstrániť deň"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => onRemoveDay(dayIndex)}
                    />
                </>
            }
        >
            <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-[minmax(260px,1fr)_180px]">
                    <AdminFormField
                        label="Názov dňa"
                        htmlFor={`program-day-label-${dayIndex}`}
                        required
                    >
                        <AdminInput
                            id={`program-day-label-${dayIndex}`}
                            value={day.label}
                            onChange={(event) =>
                                onUpdateDay(dayIndex, "label", event.target.value)
                            }
                            placeholder="Deň 1 - Streda"
                            className="text-base font-semibold"
                        />
                    </AdminFormField>

                    <AdminFormField
                        label="Dátum"
                        htmlFor={`program-day-date-${dayIndex}`}
                        required
                    >
                        <AdminInput
                            id={`program-day-date-${dayIndex}`}
                            type="date"
                            value={day.date}
                            onChange={(event) =>
                                onUpdateDay(dayIndex, "date", event.target.value)
                            }
                        />
                    </AdminFormField>
                </div>

                {day.items.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm text-gray-600">
                        Tento deň zatiaľ nemá žiadne položky.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {day.items.map((item, itemIndex) => (
                            <ProgramItemEditor
                                key={item.clientId}
                                item={item}
                                dayIndex={dayIndex}
                                itemIndex={itemIndex}
                                expanded={expanded}
                                onToggleExpanded={onToggleExpanded}
                                onUpdateItem={onUpdateItem}
                                onRemoveItem={onRemoveItem}
                                onAddSession={onAddSession}
                                onUpdateSession={onUpdateSession}
                                onRemoveSession={onRemoveSession}
                                onAddPresentation={onAddPresentation}
                                onUpdatePresentation={onUpdatePresentation}
                                onRemovePresentation={onRemovePresentation}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminCollapsiblePanel>
    );
}