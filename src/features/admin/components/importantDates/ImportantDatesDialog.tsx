import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
    createConferenceSettings,
    deleteConferenceImportantDate,
    updateConferenceImportantDate,
} from "../../../../app/api/conferenceApi.ts";

import type {
    Conference,
    ImportantDateCreateForm,
    ImportantDateUpdateForm,
} from "../../types/adminTypes.ts";

import { mapImportantDatesToEditForm } from "../../utils/adminUtils.ts";

import {
    AdminButton,
    AdminInput,
    AdminTextarea,
} from "../base/index.ts";

import {
    AdminDialog,
    AdminEmptyState,
    AdminFormField,
    AdminIconButton,
    AdminToolbar,
} from "../shared/index.ts";

type ImportantDatesDialogProps = {
    conference: Conference | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSaved: () => Promise<void>;
};

const createEmptyImportantDate = (): ImportantDateCreateForm => ({
    label: "",
    normalDate: "",
});

export function ImportantDatesDialog({
                                         conference,
                                         open,
                                         onOpenChange,
                                         onSaved,
                                     }: ImportantDatesDialogProps) {
    const [editImportantDates, setEditImportantDates] = useState<ImportantDateUpdateForm[]>([]);
    const [additionalImportantDates, setAdditionalImportantDates] = useState<ImportantDateCreateForm[]>([]);

    useEffect(() => {
        if (!conference || !open) {
            return;
        }

        setEditImportantDates(
            mapImportantDatesToEditForm(conference.settings?.importantDates).filter(
                (importantDate) => importantDate.id > 0
            )
        );
        setAdditionalImportantDates([]);
    }, [conference, open]);

    const hasRows = editImportantDates.length > 0 || additionalImportantDates.length > 0;

    const normalizedEditImportantDates = useMemo(
        () =>
            editImportantDates
                .map((importantDate) => ({
                    id: importantDate.id,
                    label: importantDate.label.trim(),
                    updatedDate: importantDate.updatedDate.trim() || null,
                }))
                .filter(
                    (importantDate) =>
                        importantDate.id > 0 && importantDate.label.length > 0
                ),
        [editImportantDates]
    );

    const normalizedAdditionalImportantDates = useMemo(
        () =>
            additionalImportantDates
                .map((importantDate) => ({
                    label: importantDate.label.trim(),
                    normalDate: importantDate.normalDate.trim(),
                }))
                .filter(
                    (importantDate) =>
                        importantDate.label.length > 0 &&
                        importantDate.normalDate.length > 0
                ),
        [additionalImportantDates]
    );

    const handleClose = () => {
        onOpenChange(false);
        setEditImportantDates([]);
        setAdditionalImportantDates([]);
    };

    const addAdditionalImportantDate = () => {
        setAdditionalImportantDates((currentDates) => [
            ...currentDates,
            createEmptyImportantDate(),
        ]);
    };

    const updateEditImportantDate = (
        index: number,
        field: keyof ImportantDateUpdateForm,
        value: string
    ) => {
        setEditImportantDates((currentDates) =>
            currentDates.map((importantDate, currentIndex) =>
                currentIndex === index
                    ? { ...importantDate, [field]: value }
                    : importantDate
            )
        );
    };

    const updateAdditionalImportantDate = (
        index: number,
        field: keyof ImportantDateCreateForm,
        value: string
    ) => {
        setAdditionalImportantDates((currentDates) =>
            currentDates.map((importantDate, currentIndex) =>
                currentIndex === index
                    ? { ...importantDate, [field]: value }
                    : importantDate
            )
        );
    };

    const removeAdditionalImportantDate = (index: number) => {
        setAdditionalImportantDates((currentDates) =>
            currentDates.filter((_, currentIndex) => currentIndex !== index)
        );
    };

    const handleDeleteExistingImportantDate = async (importantDateId: number) => {
        if (!conference || importantDateId <= 0) {
            return;
        }

        try {
            await deleteConferenceImportantDate(conference.id, importantDateId);

            setEditImportantDates((currentDates) =>
                currentDates.filter((importantDate) => importantDate.id !== importantDateId)
            );

            toast.success("Termín bol vymazaný.");
            await onSaved();
        } catch (error) {
            console.error("Failed to delete important date", error);
            toast.error("Vymazanie termínu zlyhalo.");
        }
    };

    const handleSave = async () => {
        if (!conference) {
            return;
        }

        try {
            if (normalizedEditImportantDates.length > 0) {
                await Promise.all(
                    normalizedEditImportantDates.map((importantDate) =>
                        updateConferenceImportantDate(conference.id, importantDate.id, {
                            label: importantDate.label,
                            updatedDate: importantDate.updatedDate,
                        })
                    )
                );
            }

            if (normalizedAdditionalImportantDates.length > 0) {
                await createConferenceSettings(conference.id, {
                    importantDates: normalizedAdditionalImportantDates,
                });
            }

            toast.success("Dôležité termíny boli upravené.");
            await onSaved();
            handleClose();
        } catch (error) {
            console.error("Failed to update important dates", error);
            toast.error("Úprava dôležitých termínov zlyhala.");
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
            title="Správa dôležitých termínov"
            description={
                conference
                    ? `Termíny pre konferenciu ${conference.name}`
                    : "Úprava termínov konferencie"
            }
            size="lg"
            footer={
                <>
                    <AdminButton variant="outline" onClick={handleClose}>
                        Zrušiť
                    </AdminButton>

                    <AdminButton onClick={handleSave}>
                        Uložiť termíny
                    </AdminButton>
                </>
            }
        >
            <div className="space-y-6">
                <AdminToolbar
                    description="Spravuj dôležité dátumy konferencie. Prázdne nové riadky sa pri ukladaní ignorujú."
                    actions={
                        <AdminButton
                            variant="outline"
                            onClick={addAdditionalImportantDate}
                            icon={<Plus className="h-4 w-4" />}
                        >
                            Pridať dátum
                        </AdminButton>
                    }
                />

                {!hasRows ? (
                    <AdminEmptyState
                        title="Zatiaľ žiadne termíny"
                        description="Pridaj prvý dôležitý termín konferencie."
                        action={
                            <AdminButton
                                onClick={addAdditionalImportantDate}
                                icon={<Plus className="h-4 w-4" />}
                            >
                                Pridať dátum
                            </AdminButton>
                        }
                    />
                ) : (
                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                        <div className="space-y-3">
                            {editImportantDates.map((importantDate, index) => (
                                <div
                                    key={`edit-${importantDate.id}`}
                                    className="grid min-w-0 grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-gray-50/70 p-4 lg:grid-cols-[minmax(0,1fr)_160px_160px_44px]"
                                >
                                    <AdminFormField
                                        label="Popis"
                                        htmlFor={`important-date-edit-label-${index}`}
                                        required
                                    >
                                        <AdminTextarea
                                            id={`important-date-edit-label-${index}`}
                                            value={importantDate.label}
                                            onChange={(event) =>
                                                updateEditImportantDate(index, "label", event.target.value)
                                            }
                                            rows={4}
                                            className="min-h-28 resize-y"
                                        />
                                    </AdminFormField>

                                    <AdminFormField
                                        label="Pôvodný dátum"
                                        htmlFor={`important-date-edit-normal-${index}`}
                                    >
                                        <AdminInput
                                            id={`important-date-edit-normal-${index}`}
                                            value={importantDate.normalDate}
                                            readOnly
                                            disabled
                                        />
                                    </AdminFormField>

                                    <AdminFormField
                                        label="Zmenený dátum"
                                        htmlFor={`important-date-edit-updated-${index}`}
                                    >
                                        <AdminInput
                                            id={`important-date-edit-updated-${index}`}
                                            type="date"
                                            value={importantDate.updatedDate}
                                            onChange={(event) =>
                                                updateEditImportantDate(
                                                    index,
                                                    "updatedDate",
                                                    event.target.value
                                                )
                                            }
                                        />
                                    </AdminFormField>

                                    <div className="flex items-end lg:justify-end">
                                        <AdminIconButton
                                            icon={Trash2}
                                            label="Odstrániť termín"
                                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                            onClick={() =>
                                                handleDeleteExistingImportantDate(importantDate.id)
                                            }
                                        />
                                    </div>
                                </div>
                            ))}

                            {additionalImportantDates.map((importantDate, index) => (
                                <div
                                    key={`add-${index}`}
                                    className="grid min-w-0 grid-cols-1 gap-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4 lg:grid-cols-[minmax(0,1fr)_160px_44px]"
                                >
                                    <AdminFormField
                                        label="Popis"
                                        htmlFor={`important-date-add-label-${index}`}
                                        required
                                    >
                                        <AdminTextarea
                                            id={`important-date-add-label-${index}`}
                                            value={importantDate.label}
                                            onChange={(event) =>
                                                updateAdditionalImportantDate(
                                                    index,
                                                    "label",
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Early bird registrácia"
                                            rows={4}
                                            className="min-h-28 resize-y"
                                        />
                                    </AdminFormField>

                                    <AdminFormField
                                        label="Dátum"
                                        htmlFor={`important-date-add-date-${index}`}
                                        required
                                    >
                                        <AdminInput
                                            id={`important-date-add-date-${index}`}
                                            type="date"
                                            value={importantDate.normalDate}
                                            onChange={(event) =>
                                                updateAdditionalImportantDate(
                                                    index,
                                                    "normalDate",
                                                    event.target.value
                                                )
                                            }
                                        />
                                    </AdminFormField>

                                    <div className="flex items-end lg:justify-end">
                                        <AdminIconButton
                                            icon={Trash2}
                                            label="Odstrániť nový riadok"
                                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                            onClick={() => removeAdditionalImportantDate(index)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminDialog>
    );
}