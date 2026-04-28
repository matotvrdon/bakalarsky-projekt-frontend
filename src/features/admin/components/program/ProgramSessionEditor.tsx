import { Plus, Trash2 } from "lucide-react";

import type {
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

import { ProgramPresentationEditor } from "./ProgramPresentationEditor.tsx";

type ProgramSessionEditorProps = {
    session: ProgramSessionForm;
    dayIndex: number;
    itemIndex: number;
    sessionIndex: number;
    expanded: Record<string, boolean>;
    onToggleExpanded: (key: string) => void;
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

export function ProgramSessionEditor({
                                         session,
                                         dayIndex,
                                         itemIndex,
                                         sessionIndex,
                                         expanded,
                                         onToggleExpanded,
                                         onUpdateSession,
                                         onRemoveSession,
                                         onAddPresentation,
                                         onUpdatePresentation,
                                         onRemovePresentation,
                                     }: ProgramSessionEditorProps) {
    const sessionExpandedKey = `session-${session.clientId}`;
    const isSessionExpanded = expanded[sessionExpandedKey] ?? true;

    return (
        <AdminCollapsiblePanel
            title={session.sessionName || `Session ${sessionIndex + 1}`}
            subtitle={`${session.startTime || "--:--"} - ${session.endTime || "--:--"}`}
            expanded={isSessionExpanded}
            onToggle={() => onToggleExpanded(sessionExpandedKey)}
            variant="white"
            actions={
                <>
                    <AdminButton
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            onAddPresentation(dayIndex, itemIndex, sessionIndex)
                        }
                        icon={<Plus className="h-4 w-4" />}
                    >
                        Príspevok
                    </AdminButton>

                    <AdminIconButton
                        icon={Trash2}
                        label="Odstrániť session"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() =>
                            onRemoveSession(dayIndex, itemIndex, sessionIndex)
                        }
                    />
                </>
            }
        >
            <div className="space-y-4">
                <AdminFormGrid columns={4}>
                    <AdminFormField
                        label="Názov session"
                        htmlFor={`program-session-name-${dayIndex}-${itemIndex}-${sessionIndex}`}
                        required
                    >
                        <AdminInput
                            id={`program-session-name-${dayIndex}-${itemIndex}-${sessionIndex}`}
                            value={session.sessionName}
                            onChange={(event) =>
                                onUpdateSession(
                                    dayIndex,
                                    itemIndex,
                                    sessionIndex,
                                    "sessionName",
                                    event.target.value
                                )
                            }
                            placeholder="Session A"
                        />
                    </AdminFormField>

                    <AdminFormField
                        label="Začiatok"
                        htmlFor={`program-session-start-${dayIndex}-${itemIndex}-${sessionIndex}`}
                        required
                    >
                        <AdminInput
                            id={`program-session-start-${dayIndex}-${itemIndex}-${sessionIndex}`}
                            type="time"
                            value={session.startTime}
                            onChange={(event) =>
                                onUpdateSession(
                                    dayIndex,
                                    itemIndex,
                                    sessionIndex,
                                    "startTime",
                                    event.target.value
                                )
                            }
                        />
                    </AdminFormField>

                    <AdminFormField
                        label="Koniec"
                        htmlFor={`program-session-end-${dayIndex}-${itemIndex}-${sessionIndex}`}
                        required
                    >
                        <AdminInput
                            id={`program-session-end-${dayIndex}-${itemIndex}-${sessionIndex}`}
                            type="time"
                            value={session.endTime}
                            onChange={(event) =>
                                onUpdateSession(
                                    dayIndex,
                                    itemIndex,
                                    sessionIndex,
                                    "endTime",
                                    event.target.value
                                )
                            }
                        />
                    </AdminFormField>

                    <AdminFormField
                        label="Chair"
                        htmlFor={`program-session-chair-${dayIndex}-${itemIndex}-${sessionIndex}`}
                    >
                        <AdminInput
                            id={`program-session-chair-${dayIndex}-${itemIndex}-${sessionIndex}`}
                            value={session.chair}
                            onChange={(event) =>
                                onUpdateSession(
                                    dayIndex,
                                    itemIndex,
                                    sessionIndex,
                                    "chair",
                                    event.target.value
                                )
                            }
                            placeholder="Chair name"
                        />
                    </AdminFormField>
                </AdminFormGrid>

                <div className="space-y-3">
                    {session.presentations.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-sm text-gray-600">
                            Táto session zatiaľ nemá žiadne príspevky.
                        </div>
                    ) : (
                        session.presentations.map((presentation, presentationIndex) => (
                            <ProgramPresentationEditor
                                key={presentation.clientId}
                                presentation={presentation}
                                dayIndex={dayIndex}
                                itemIndex={itemIndex}
                                sessionIndex={sessionIndex}
                                presentationIndex={presentationIndex}
                                onUpdatePresentation={onUpdatePresentation}
                                onRemovePresentation={onRemovePresentation}
                            />
                        ))
                    )}
                </div>
            </div>
        </AdminCollapsiblePanel>
    );
}