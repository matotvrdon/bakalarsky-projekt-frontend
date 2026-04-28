import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
    replaceConferenceProgram,
    type ProgramItemType,
} from "../../../../api/conferenceApi.ts";

import type {
    Conference,
    ProgramDayForm,
    ProgramItemForm,
    ProgramPresentationForm,
    ProgramSessionForm,
} from "../../types/adminTypes.ts";

import { ProgramTypeLegend } from "./ProgramTypeLegend.tsx";

import {
    createEmptyProgramDay,
    createEmptyProgramItem,
    createEmptyProgramPresentation,
    createEmptyProgramSession,
    mapProgramDaysToForm,
} from "../../utils/adminUtils.ts";

import {
    AdminButton,
} from "../base/index.ts";

import {
    AdminDialog,
    AdminEmptyState,
    AdminToolbar,
} from "../shared/index.ts";

import { ProgramDayEditor } from "./ProgramDayEditor.tsx";

type ProgramDialogProps = {
    conference: Conference | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSaved: () => Promise<void>;
};

export function ProgramDialog({
                                  conference,
                                  open,
                                  onOpenChange,
                                  onSaved,
                              }: ProgramDialogProps) {
    const [programDaysForm, setProgramDaysForm] = useState<ProgramDayForm[]>([]);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (!conference || !open) {
            return;
        }

        const mappedDays = mapProgramDaysToForm(conference.settings?.programDays);

        const nextExpanded: Record<string, boolean> = {};

        mappedDays.forEach((day) => {
            nextExpanded[`day-${day.clientId}`] = true;

            day.items.forEach((item) => {
                nextExpanded[`item-${item.clientId}`] = true;

                item.sessions.forEach((session) => {
                    nextExpanded[`session-${session.clientId}`] = true;
                });
            });
        });

        setProgramDaysForm(mappedDays);
        setExpanded(nextExpanded);
    }, [conference, open]);

    const hasRows = programDaysForm.length > 0;

    const handleClose = () => {
        onOpenChange(false);
        setProgramDaysForm([]);
        setExpanded({});
    };

    const toggleExpanded = (key: string) => {
        setExpanded((current) => ({
            ...current,
            [key]: !current[key],
        }));
    };

    const addProgramDay = () => {
        const nextDay = createEmptyProgramDay();

        setProgramDaysForm((currentDays) => [...currentDays, nextDay]);

        setExpanded((current) => ({
            ...current,
            [`day-${nextDay.clientId}`]: true,
        }));
    };

    const removeProgramDay = (dayIndex: number) => {
        setProgramDaysForm((currentDays) =>
            currentDays.filter((_, currentIndex) => currentIndex !== dayIndex)
        );
    };

    const clearProgramDays = () => {
        setProgramDaysForm([]);
        setExpanded({});
    };

    const updateProgramDay = (
        dayIndex: number,
        field: keyof Omit<ProgramDayForm, "clientId" | "items">,
        value: string
    ) => {
        setProgramDaysForm((currentDays) =>
            currentDays.map((day, currentIndex) =>
                currentIndex === dayIndex ? { ...day, [field]: value } : day
            )
        );
    };

    const addProgramItem = (dayIndex: number) => {
        const nextItem = createEmptyProgramItem();

        setProgramDaysForm((currentDays) =>
            currentDays.map((day, currentDayIndex) =>
                currentDayIndex === dayIndex
                    ? { ...day, items: [...day.items, nextItem] }
                    : day
            )
        );

        setExpanded((current) => ({
            ...current,
            [`item-${nextItem.clientId}`]: true,
        }));
    };

    const removeProgramItem = (dayIndex: number, itemIndex: number) => {
        setProgramDaysForm((currentDays) =>
            currentDays.map((day, currentDayIndex) =>
                currentDayIndex !== dayIndex
                    ? day
                    : {
                        ...day,
                        items: day.items.filter(
                            (_, currentItemIndex) => currentItemIndex !== itemIndex
                        ),
                    }
            )
        );
    };

    const updateProgramItem = (
        dayIndex: number,
        itemIndex: number,
        field: keyof Omit<ProgramItemForm, "clientId" | "sessions">,
        value: string | ProgramItemType
    ) => {
        setProgramDaysForm((currentDays) =>
            currentDays.map((day, currentDayIndex) =>
                currentDayIndex !== dayIndex
                    ? day
                    : {
                        ...day,
                        items: day.items.map((item, currentItemIndex) =>
                            currentItemIndex === itemIndex
                                ? { ...item, [field]: value }
                                : item
                        ),
                    }
            )
        );
    };

    const addProgramSession = (dayIndex: number, itemIndex: number) => {
        const nextSession = createEmptyProgramSession();

        setProgramDaysForm((currentDays) =>
            currentDays.map((day, currentDayIndex) =>
                currentDayIndex !== dayIndex
                    ? day
                    : {
                        ...day,
                        items: day.items.map((item, currentItemIndex) =>
                            currentItemIndex === itemIndex
                                ? {
                                    ...item,
                                    sessions: [...item.sessions, nextSession],
                                }
                                : item
                        ),
                    }
            )
        );

        setExpanded((current) => ({
            ...current,
            [`session-${nextSession.clientId}`]: true,
        }));
    };

    const removeProgramSession = (
        dayIndex: number,
        itemIndex: number,
        sessionIndex: number
    ) => {
        setProgramDaysForm((currentDays) =>
            currentDays.map((day, currentDayIndex) =>
                currentDayIndex !== dayIndex
                    ? day
                    : {
                        ...day,
                        items: day.items.map((item, currentItemIndex) =>
                            currentItemIndex !== itemIndex
                                ? item
                                : {
                                    ...item,
                                    sessions: item.sessions.filter(
                                        (_, currentSessionIndex) =>
                                            currentSessionIndex !== sessionIndex
                                    ),
                                }
                        ),
                    }
            )
        );
    };

    const updateProgramSession = (
        dayIndex: number,
        itemIndex: number,
        sessionIndex: number,
        field: keyof Omit<ProgramSessionForm, "clientId" | "presentations">,
        value: string
    ) => {
        setProgramDaysForm((currentDays) =>
            currentDays.map((day, currentDayIndex) =>
                currentDayIndex !== dayIndex
                    ? day
                    : {
                        ...day,
                        items: day.items.map((item, currentItemIndex) =>
                            currentItemIndex !== itemIndex
                                ? item
                                : {
                                    ...item,
                                    sessions: item.sessions.map(
                                        (session, currentSessionIndex) =>
                                            currentSessionIndex === sessionIndex
                                                ? { ...session, [field]: value }
                                                : session
                                    ),
                                }
                        ),
                    }
            )
        );
    };

    const addProgramPresentation = (
        dayIndex: number,
        itemIndex: number,
        sessionIndex: number
    ) => {
        const nextPresentation = createEmptyProgramPresentation();

        setProgramDaysForm((currentDays) =>
            currentDays.map((day, currentDayIndex) =>
                currentDayIndex !== dayIndex
                    ? day
                    : {
                        ...day,
                        items: day.items.map((item, currentItemIndex) =>
                            currentItemIndex !== itemIndex
                                ? item
                                : {
                                    ...item,
                                    sessions: item.sessions.map(
                                        (session, currentSessionIndex) =>
                                            currentSessionIndex === sessionIndex
                                                ? {
                                                    ...session,
                                                    presentations: [
                                                        ...session.presentations,
                                                        nextPresentation,
                                                    ],
                                                }
                                                : session
                                    ),
                                }
                        ),
                    }
            )
        );
    };

    const removeProgramPresentation = (
        dayIndex: number,
        itemIndex: number,
        sessionIndex: number,
        presentationIndex: number
    ) => {
        setProgramDaysForm((currentDays) =>
            currentDays.map((day, currentDayIndex) =>
                currentDayIndex !== dayIndex
                    ? day
                    : {
                        ...day,
                        items: day.items.map((item, currentItemIndex) =>
                            currentItemIndex !== itemIndex
                                ? item
                                : {
                                    ...item,
                                    sessions: item.sessions.map(
                                        (session, currentSessionIndex) =>
                                            currentSessionIndex !== sessionIndex
                                                ? session
                                                : {
                                                    ...session,
                                                    presentations:
                                                        session.presentations.filter(
                                                            (_, currentPresentationIndex) =>
                                                                currentPresentationIndex !==
                                                                presentationIndex
                                                        ),
                                                }
                                    ),
                                }
                        ),
                    }
            )
        );
    };

    const updateProgramPresentation = (
        dayIndex: number,
        itemIndex: number,
        sessionIndex: number,
        presentationIndex: number,
        field: keyof Omit<ProgramPresentationForm, "clientId">,
        value: string
    ) => {
        setProgramDaysForm((currentDays) =>
            currentDays.map((day, currentDayIndex) =>
                currentDayIndex !== dayIndex
                    ? day
                    : {
                        ...day,
                        items: day.items.map((item, currentItemIndex) =>
                            currentItemIndex !== itemIndex
                                ? item
                                : {
                                    ...item,
                                    sessions: item.sessions.map(
                                        (session, currentSessionIndex) =>
                                            currentSessionIndex !== sessionIndex
                                                ? session
                                                : {
                                                    ...session,
                                                    presentations:
                                                        session.presentations.map(
                                                            (
                                                                presentation,
                                                                currentPresentationIndex
                                                            ) =>
                                                                currentPresentationIndex ===
                                                                presentationIndex
                                                                    ? {
                                                                        ...presentation,
                                                                        [field]: value,
                                                                    }
                                                                    : presentation
                                                        ),
                                                }
                                    ),
                                }
                        ),
                    }
            )
        );
    };

    const hasInvalidProgram = () =>
        programDaysForm.some((day) =>
            !day.label.trim() ||
            !day.date ||
            day.items.some((item) =>
                !item.title.trim() ||
                !item.startTime ||
                !item.endTime ||
                item.sessions.some((session) =>
                    !session.sessionName.trim() ||
                    !session.startTime ||
                    !session.endTime ||
                    session.presentations.some(
                        (presentation) =>
                            !presentation.title.trim() ||
                            !presentation.authors.trim() ||
                            !presentation.startTime ||
                            !presentation.endTime
                    )
                )
            )
        );

    const handleSaveProgram = async () => {
        if (!conference) {
            return;
        }

        if (hasInvalidProgram()) {
            toast.error("Vyplň všetky povinné polia programu.");
            return;
        }

        try {
            await replaceConferenceProgram(conference.id, {
                programDays: programDaysForm.map((day, dayIndex) => ({
                    label: day.label.trim(),
                    date: day.date,
                    order: dayIndex,
                    programItems: day.items.map((item, itemIndex) => ({
                        title: item.title.trim(),
                        startTime: item.startTime,
                        endTime: item.endTime,
                        location: item.location.trim() || null,
                        speaker: item.speaker.trim() || null,
                        chair: item.chair.trim() || null,
                        type: item.type,
                        order: itemIndex,
                        sessions: item.sessions.map((session, sessionIndex) => ({
                            sessionName: session.sessionName.trim(),
                            startTime: session.startTime,
                            endTime: session.endTime,
                            chair: session.chair.trim() || null,
                            order: sessionIndex,
                            presentations: session.presentations.map(
                                (presentation, presentationIndex) => ({
                                    startTime: presentation.startTime,
                                    endTime: presentation.endTime,
                                    authors: presentation.authors.trim(),
                                    title: presentation.title.trim(),
                                    order: presentationIndex,
                                })
                            ),
                        })),
                    })),
                })),
            });

            toast.success("Program konferencie bol uložený.");
            await onSaved();
            handleClose();
        } catch (error) {
            console.error("Failed to save program", error);
            toast.error("Uloženie programu zlyhalo.");
        }
    };

    return (
        <AdminDialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                    handleClose();
                    return;
                }

                onOpenChange(nextOpen);
            }}
            title="Program konferencie"
            description={
                conference
                    ? `Vytváranie a správa programu konferencie ${conference.name}`
                    : "Vytváranie a správa programu konferencie"
            }
            size="xl"
            footer={
                <>
                    <AdminButton variant="outline" onClick={handleClose}>
                        Zrušiť
                    </AdminButton>

                    <AdminButton onClick={handleSaveProgram}>
                        Uložiť program
                    </AdminButton>
                </>
            }
        >
            <div className="space-y-6">
                <AdminToolbar
                    description="Program sa skladá z dní, položiek, session a príspevkov. Prázdny program môžeš nechať bez dní."
                    actions={
                        <>
                            <AdminButton
                                variant="outline"
                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={clearProgramDays}
                                icon={<Trash2 className="h-4 w-4" />}
                                disabled={!hasRows}
                            >
                                Vymazať všetko
                            </AdminButton>

                            <AdminButton
                                onClick={addProgramDay}
                                icon={<Plus className="h-4 w-4" />}
                            >
                                Pridať deň
                            </AdminButton>
                        </>
                    }
                />

                <ProgramTypeLegend />

                {!hasRows ? (
                    <AdminEmptyState
                        title="Program je prázdny"
                        description="Pridaj prvý deň programu."
                        action={
                            <AdminButton
                                onClick={addProgramDay}
                                icon={<Plus className="h-4 w-4" />}
                            >
                                Pridať deň
                            </AdminButton>
                        }
                    />
                ) : (
                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                        <div className="space-y-5">
                            {programDaysForm.map((day, dayIndex) => (
                                <ProgramDayEditor
                                    key={day.clientId}
                                    day={day}
                                    dayIndex={dayIndex}
                                    expanded={expanded}
                                    onToggleExpanded={toggleExpanded}
                                    onUpdateDay={updateProgramDay}
                                    onRemoveDay={removeProgramDay}
                                    onAddItem={addProgramItem}
                                    onUpdateItem={updateProgramItem}
                                    onRemoveItem={removeProgramItem}
                                    onAddSession={addProgramSession}
                                    onUpdateSession={updateProgramSession}
                                    onRemoveSession={removeProgramSession}
                                    onAddPresentation={addProgramPresentation}
                                    onUpdatePresentation={updateProgramPresentation}
                                    onRemovePresentation={removeProgramPresentation}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminDialog>
    );
}