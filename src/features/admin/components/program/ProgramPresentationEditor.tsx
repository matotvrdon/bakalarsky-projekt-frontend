import { Trash2 } from "lucide-react";

import type { ProgramPresentationForm } from "../../types/adminTypes.ts";

import {
    AdminInput,
} from "../base/index.ts";

import {
    AdminFormField,
    AdminIconButton,
} from "../shared/index.ts";

type ProgramPresentationEditorProps = {
    presentation: ProgramPresentationForm;
    dayIndex: number;
    itemIndex: number;
    sessionIndex: number;
    presentationIndex: number;
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

export function ProgramPresentationEditor({
                                              presentation,
                                              dayIndex,
                                              itemIndex,
                                              sessionIndex,
                                              presentationIndex,
                                              onUpdatePresentation,
                                              onRemovePresentation,
                                          }: ProgramPresentationEditorProps) {
    return (
        <div className="grid gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 md:grid-cols-[110px_110px_minmax(180px,1fr)_minmax(220px,1.4fr)_44px]">
            <AdminFormField
                label="Začiatok"
                htmlFor={`program-presentation-start-${dayIndex}-${itemIndex}-${sessionIndex}-${presentationIndex}`}
                required
            >
                <AdminInput
                    id={`program-presentation-start-${dayIndex}-${itemIndex}-${sessionIndex}-${presentationIndex}`}
                    type="time"
                    value={presentation.startTime}
                    onChange={(event) =>
                        onUpdatePresentation(
                            dayIndex,
                            itemIndex,
                            sessionIndex,
                            presentationIndex,
                            "startTime",
                            event.target.value
                        )
                    }
                />
            </AdminFormField>

            <AdminFormField
                label="Koniec"
                htmlFor={`program-presentation-end-${dayIndex}-${itemIndex}-${sessionIndex}-${presentationIndex}`}
                required
            >
                <AdminInput
                    id={`program-presentation-end-${dayIndex}-${itemIndex}-${sessionIndex}-${presentationIndex}`}
                    type="time"
                    value={presentation.endTime}
                    onChange={(event) =>
                        onUpdatePresentation(
                            dayIndex,
                            itemIndex,
                            sessionIndex,
                            presentationIndex,
                            "endTime",
                            event.target.value
                        )
                    }
                />
            </AdminFormField>

            <AdminFormField
                label="Autori"
                htmlFor={`program-presentation-authors-${dayIndex}-${itemIndex}-${sessionIndex}-${presentationIndex}`}
                required
            >
                <AdminInput
                    id={`program-presentation-authors-${dayIndex}-${itemIndex}-${sessionIndex}-${presentationIndex}`}
                    value={presentation.authors}
                    onChange={(event) =>
                        onUpdatePresentation(
                            dayIndex,
                            itemIndex,
                            sessionIndex,
                            presentationIndex,
                            "authors",
                            event.target.value
                        )
                    }
                    placeholder="Autor 1, Autor 2"
                />
            </AdminFormField>

            <AdminFormField
                label="Názov príspevku"
                htmlFor={`program-presentation-title-${dayIndex}-${itemIndex}-${sessionIndex}-${presentationIndex}`}
                required
            >
                <AdminInput
                    id={`program-presentation-title-${dayIndex}-${itemIndex}-${sessionIndex}-${presentationIndex}`}
                    value={presentation.title}
                    onChange={(event) =>
                        onUpdatePresentation(
                            dayIndex,
                            itemIndex,
                            sessionIndex,
                            presentationIndex,
                            "title",
                            event.target.value
                        )
                    }
                    placeholder="Názov prezentácie"
                />
            </AdminFormField>

            <div className="flex items-end">
                <AdminIconButton
                    icon={Trash2}
                    label="Odstrániť príspevok"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() =>
                        onRemovePresentation(
                            dayIndex,
                            itemIndex,
                            sessionIndex,
                            presentationIndex
                        )
                    }
                />
            </div>
        </div>
    );
}