import { Plus, Trash2 } from "lucide-react";

import type {
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
    AdminFormGrid,
    AdminIconButton,
} from "../shared/index.ts";

import {
    getProgramItemAdminClassName,
    getProgramItemBadgeClassName,
    getProgramItemSelectClassName,
    getProgramItemTypeLabel,
    programLegendItems,
} from "../../utils/adminUtils.ts";

import { ProgramSessionEditor } from "./ProgramSessionEditor.tsx";

type ProgramItemEditorProps = {
    item: ProgramItemForm;
    dayIndex: number;
    itemIndex: number;
    expanded: Record<string, boolean>;
    onToggleExpanded: (key: string) => void;
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

export function ProgramItemEditor({
                                      item,
                                      dayIndex,
                                      itemIndex,
                                      expanded,
                                      onToggleExpanded,
                                      onUpdateItem,
                                      onRemoveItem,
                                      onAddSession,
                                      onUpdateSession,
                                      onRemoveSession,
                                      onAddPresentation,
                                      onUpdatePresentation,
                                      onRemovePresentation,
                                  }: ProgramItemEditorProps) {
    const itemExpandedKey = `item-${item.clientId}`;
    const isItemExpanded = expanded[itemExpandedKey] ?? true;

    const subtitle = `${item.startTime || "--:--"} - ${item.endTime || "--:--"}${
        item.location ? ` • ${item.location}` : ""
    }`;

    const itemColorClassName = getProgramItemAdminClassName(item.type);
    const badgeClassName = getProgramItemBadgeClassName(item.type);
    const selectClassName = getProgramItemSelectClassName(item.type);

    return (
        <div
            className={[
                "rounded-2xl border-l-4",
                itemColorClassName,
            ].join(" ")}
        >
            <AdminCollapsiblePanel
                title={item.title || `Položka ${itemIndex + 1}`}
                subtitle={subtitle}
                expanded={isItemExpanded}
                onToggle={() => onToggleExpanded(itemExpandedKey)}
                variant="white"
                actions={
                    <>
                        <span
                            className={[
                                "rounded-full border px-2.5 py-1 text-xs font-semibold",
                                badgeClassName,
                            ].join(" ")}
                        >
                            {getProgramItemTypeLabel(item.type)}
                        </span>

                        <AdminButton
                            variant="outline"
                            size="sm"
                            onClick={() => onAddSession(dayIndex, itemIndex)}
                            icon={<Plus className="h-4 w-4" />}
                        >
                            Session
                        </AdminButton>

                        <AdminIconButton
                            icon={Trash2}
                            label="Odstrániť položku"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => onRemoveItem(dayIndex, itemIndex)}
                        />
                    </>
                }
            >
                <div className="space-y-5">
                    <AdminFormGrid columns={4}>
                        <AdminFormField
                            label="Názov položky"
                            htmlFor={`program-item-title-${dayIndex}-${itemIndex}`}
                            required
                        >
                            <AdminInput
                                id={`program-item-title-${dayIndex}-${itemIndex}`}
                                value={item.title}
                                onChange={(event) =>
                                    onUpdateItem(
                                        dayIndex,
                                        itemIndex,
                                        "title",
                                        event.target.value
                                    )
                                }
                                placeholder="Registrácia účastníkov"
                            />
                        </AdminFormField>

                        <AdminFormField
                            label="Začiatok"
                            htmlFor={`program-item-start-${dayIndex}-${itemIndex}`}
                            required
                        >
                            <AdminInput
                                id={`program-item-start-${dayIndex}-${itemIndex}`}
                                type="time"
                                value={item.startTime}
                                onChange={(event) =>
                                    onUpdateItem(
                                        dayIndex,
                                        itemIndex,
                                        "startTime",
                                        event.target.value
                                    )
                                }
                            />
                        </AdminFormField>

                        <AdminFormField
                            label="Koniec"
                            htmlFor={`program-item-end-${dayIndex}-${itemIndex}`}
                            required
                        >
                            <AdminInput
                                id={`program-item-end-${dayIndex}-${itemIndex}`}
                                type="time"
                                value={item.endTime}
                                onChange={(event) =>
                                    onUpdateItem(
                                        dayIndex,
                                        itemIndex,
                                        "endTime",
                                        event.target.value
                                    )
                                }
                            />
                        </AdminFormField>

                        <AdminFormField
                            label="Typ"
                            htmlFor={`program-item-type-${dayIndex}-${itemIndex}`}
                            required
                        >
                            <select
                                id={`program-item-type-${dayIndex}-${itemIndex}`}
                                value={String(item.type)}
                                onChange={(event) =>
                                    onUpdateItem(
                                        dayIndex,
                                        itemIndex,
                                        "type",
                                        Number(event.target.value) as ProgramItemType
                                    )
                                }
                                className={[
                                    "h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2",
                                    selectClassName,
                                ].join(" ")}
                            >
                                {programLegendItems.map((type) => (
                                    <option key={type.type} value={type.type}>
                                        {type.valueLabel}
                                    </option>
                                ))}
                            </select>
                        </AdminFormField>
                    </AdminFormGrid>

                    <AdminFormGrid columns={3}>
                        <AdminFormField
                            label="Miesto"
                            htmlFor={`program-item-location-${dayIndex}-${itemIndex}`}
                        >
                            <AdminInput
                                id={`program-item-location-${dayIndex}-${itemIndex}`}
                                value={item.location}
                                onChange={(event) =>
                                    onUpdateItem(
                                        dayIndex,
                                        itemIndex,
                                        "location",
                                        event.target.value
                                    )
                                }
                                placeholder="Tatra Hotel – Registration point"
                            />
                        </AdminFormField>

                        <AdminFormField
                            label="Speaker"
                            htmlFor={`program-item-speaker-${dayIndex}-${itemIndex}`}
                        >
                            <AdminInput
                                id={`program-item-speaker-${dayIndex}-${itemIndex}`}
                                value={item.speaker}
                                onChange={(event) =>
                                    onUpdateItem(
                                        dayIndex,
                                        itemIndex,
                                        "speaker",
                                        event.target.value
                                    )
                                }
                                placeholder="Speaker name"
                            />
                        </AdminFormField>

                        <AdminFormField
                            label="Chair"
                            htmlFor={`program-item-chair-${dayIndex}-${itemIndex}`}
                        >
                            <AdminInput
                                id={`program-item-chair-${dayIndex}-${itemIndex}`}
                                value={item.chair}
                                onChange={(event) =>
                                    onUpdateItem(
                                        dayIndex,
                                        itemIndex,
                                        "chair",
                                        event.target.value
                                    )
                                }
                                placeholder="Chair name"
                            />
                        </AdminFormField>
                    </AdminFormGrid>

                    <div className="space-y-3">
                        {item.sessions.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-5 text-sm text-gray-600">
                                Táto položka zatiaľ nemá žiadne session. Pri bežných položkách ako lunch alebo break to nevadí.
                            </div>
                        ) : (
                            item.sessions.map((session, sessionIndex) => (
                                <ProgramSessionEditor
                                    key={session.clientId}
                                    session={session}
                                    dayIndex={dayIndex}
                                    itemIndex={itemIndex}
                                    sessionIndex={sessionIndex}
                                    expanded={expanded}
                                    onToggleExpanded={onToggleExpanded}
                                    onUpdateSession={onUpdateSession}
                                    onRemoveSession={onRemoveSession}
                                    onAddPresentation={onAddPresentation}
                                    onUpdatePresentation={onUpdatePresentation}
                                    onRemovePresentation={onRemovePresentation}
                                />
                            ))
                        )}
                    </div>
                </div>
            </AdminCollapsiblePanel>
        </div>
    );
}