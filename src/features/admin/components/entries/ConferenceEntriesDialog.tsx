import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
    createConferenceEntries,
    deleteConferenceEntry,
    updateConferenceEntry,
} from "../../../../app/api/conferenceApi.ts";

import type {
    Conference,
    ConferenceEntryCreateForm,
    ConferenceEntryUpdateForm,
} from "../../types/adminTypes.ts";

import {
    createEmptyConferenceEntryForm,
    mapConferenceEntriesToEditForm,
    parseDecimalValue,
} from "../../utils/adminUtils.ts";

import {
    AdminButton,
    AdminInput,
} from "../base/index.ts";

import {
    AdminDialog,
    AdminEmptyState,
    AdminFormField,
    AdminIconButton,
    AdminToolbar,
} from "../shared/index.ts";

type ConferenceEntriesDialogProps = {
    conference: Conference | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSaved: () => Promise<void>;
};

export function ConferenceEntriesDialog({
                                            conference,
                                            open,
                                            onOpenChange,
                                            onSaved,
                                        }: ConferenceEntriesDialogProps) {
    const [editConferenceEntries, setEditConferenceEntries] = useState<ConferenceEntryUpdateForm[]>([]);
    const [additionalConferenceEntries, setAdditionalConferenceEntries] = useState<ConferenceEntryCreateForm[]>([]);

    useEffect(() => {
        if (!conference || !open) {
            return;
        }

        setEditConferenceEntries(
            mapConferenceEntriesToEditForm(conference.settings?.conferenceEntries)
        );
        setAdditionalConferenceEntries([]);
    }, [conference, open]);

    const hasRows = editConferenceEntries.length > 0 || additionalConferenceEntries.length > 0;

    const normalizedEditConferenceEntries = useMemo(
        () =>
            editConferenceEntries
                .map((conferenceEntry) => ({
                    id: conferenceEntry.id,
                    name: conferenceEntry.name.trim(),
                    price: parseDecimalValue(conferenceEntry.price),
                }))
                .filter(
                    (conferenceEntry) =>
                        conferenceEntry.id > 0 &&
                        conferenceEntry.name.length > 0 &&
                        Number.isFinite(conferenceEntry.price)
                ),
        [editConferenceEntries]
    );

    const normalizedAdditionalConferenceEntries = useMemo(
        () =>
            additionalConferenceEntries
                .map((conferenceEntry) => ({
                    name: conferenceEntry.name.trim(),
                    price: parseDecimalValue(conferenceEntry.price),
                }))
                .filter(
                    (conferenceEntry) =>
                        conferenceEntry.name.length > 0 &&
                        Number.isFinite(conferenceEntry.price)
                ),
        [additionalConferenceEntries]
    );

    const handleClose = () => {
        onOpenChange(false);
        setEditConferenceEntries([]);
        setAdditionalConferenceEntries([]);
    };

    const addAdditionalConferenceEntry = () => {
        setAdditionalConferenceEntries((currentEntries) => [
            ...currentEntries,
            createEmptyConferenceEntryForm(),
        ]);
    };

    const updateEditConferenceEntry = (
        index: number,
        field: keyof ConferenceEntryUpdateForm,
        value: string
    ) => {
        setEditConferenceEntries((currentEntries) =>
            currentEntries.map((conferenceEntry, currentIndex) =>
                currentIndex === index
                    ? { ...conferenceEntry, [field]: value }
                    : conferenceEntry
            )
        );
    };

    const updateAdditionalConferenceEntry = (
        index: number,
        field: keyof ConferenceEntryCreateForm,
        value: string
    ) => {
        setAdditionalConferenceEntries((currentEntries) =>
            currentEntries.map((conferenceEntry, currentIndex) =>
                currentIndex === index
                    ? { ...conferenceEntry, [field]: value }
                    : conferenceEntry
            )
        );
    };

    const removeAdditionalConferenceEntry = (index: number) => {
        setAdditionalConferenceEntries((currentEntries) =>
            currentEntries.filter((_, currentIndex) => currentIndex !== index)
        );
    };

    const handleDeleteExistingConferenceEntry = async (conferenceEntryId: number) => {
        if (!conference || conferenceEntryId <= 0) {
            return;
        }

        try {
            await deleteConferenceEntry(conference.id, conferenceEntryId);

            setEditConferenceEntries((currentEntries) =>
                currentEntries.filter(
                    (conferenceEntry) => conferenceEntry.id !== conferenceEntryId
                )
            );

            toast.success("Conference entry bol vymazaný.");
            await onSaved();
        } catch (error) {
            console.error("Failed to delete conference entry", error);
            toast.error("Vymazanie conference entry zlyhalo.");
        }
    };

    const handleSave = async () => {
        if (!conference) {
            return;
        }

        const hasInvalidPrice = [
            ...editConferenceEntries,
            ...additionalConferenceEntries,
        ].some(
            (conferenceEntry) =>
                conferenceEntry.name.trim().length > 0 &&
                !Number.isFinite(parseDecimalValue(conferenceEntry.price))
        );

        if (hasInvalidPrice) {
            toast.error("Zadajte platnú cenu pre conference entry.");
            return;
        }

        try {
            if (normalizedEditConferenceEntries.length > 0) {
                await Promise.all(
                    normalizedEditConferenceEntries.map((conferenceEntry) =>
                        updateConferenceEntry(conference.id, conferenceEntry.id, {
                            name: conferenceEntry.name,
                            price: conferenceEntry.price,
                        })
                    )
                );
            }

            if (normalizedAdditionalConferenceEntries.length > 0) {
                await createConferenceEntries(conference.id, {
                    conferenceEntries: normalizedAdditionalConferenceEntries,
                });
            }

            toast.success("Conference entry možnosti boli upravené.");
            await onSaved();
            handleClose();
        } catch (error) {
            console.error("Failed to update conference entries", error);
            toast.error("Úprava conference entry možností zlyhala.");
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
            title="Správa conference entry"
            description={
                conference
                    ? `Typy vstupu pre konferenciu ${conference.name}`
                    : "Úprava conference entry možností"
            }
            size="lg"
            footer={
                <>
                    <AdminButton variant="outline" onClick={handleClose}>
                        Zrušiť
                    </AdminButton>

                    <AdminButton onClick={handleSave}>
                        Uložiť conference entry
                    </AdminButton>
                </>
            }
        >
            <div className="space-y-6">
                <AdminToolbar
                    description="Nastav typy vstupu pre registráciu účastníkov. Prázdne nové riadky sa pri ukladaní ignorujú."
                    actions={
                        <AdminButton
                            variant="outline"
                            onClick={addAdditionalConferenceEntry}
                            icon={<Plus className="h-4 w-4" />}
                        >
                            Pridať možnosť
                        </AdminButton>
                    }
                />

                {!hasRows ? (
                    <AdminEmptyState
                        title="Zatiaľ žiadne conference entry"
                        description="Pridaj prvú možnosť vstupu, napríklad Regular, Student alebo VIP."
                        action={
                            <AdminButton
                                onClick={addAdditionalConferenceEntry}
                                icon={<Plus className="h-4 w-4" />}
                            >
                                Pridať možnosť
                            </AdminButton>
                        }
                    />
                ) : (
                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                        <div className="space-y-3">
                            {editConferenceEntries.map((conferenceEntry, index) => (
                                <div
                                    key={`edit-${conferenceEntry.id}`}
                                    className="grid min-w-0 grid-cols-1 gap-3 rounded-xl border border-gray-200 bg-gray-50/70 p-4 md:grid-cols-[minmax(0,1fr)_160px_44px] md:items-end"
                                >
                                    <AdminFormField
                                        label="Názov"
                                        htmlFor={`conference-entry-edit-name-${index}`}
                                        required
                                    >
                                        <AdminInput
                                            id={`conference-entry-edit-name-${index}`}
                                            value={conferenceEntry.name}
                                            onChange={(event) =>
                                                updateEditConferenceEntry(
                                                    index,
                                                    "name",
                                                    event.target.value
                                                )
                                            }
                                        />
                                    </AdminFormField>

                                    <AdminFormField
                                        label="Cena"
                                        htmlFor={`conference-entry-edit-price-${index}`}
                                        required
                                    >
                                        <AdminInput
                                            id={`conference-entry-edit-price-${index}`}
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={conferenceEntry.price}
                                            onChange={(event) =>
                                                updateEditConferenceEntry(
                                                    index,
                                                    "price",
                                                    event.target.value
                                                )
                                            }
                                        />
                                    </AdminFormField>

                                    <div className="flex md:justify-end">
                                        <AdminIconButton
                                            icon={Trash2}
                                            label="Odstrániť conference entry"
                                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                            onClick={() =>
                                                handleDeleteExistingConferenceEntry(conferenceEntry.id)
                                            }
                                        />
                                    </div>
                                </div>
                            ))}

                            {additionalConferenceEntries.map((conferenceEntry, index) => (
                                <div
                                    key={`add-${index}`}
                                    className="grid min-w-0 grid-cols-1 gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4 md:grid-cols-[minmax(0,1fr)_160px_44px] md:items-end"
                                >
                                    <AdminFormField
                                        label="Názov"
                                        htmlFor={`conference-entry-add-name-${index}`}
                                        required
                                    >
                                        <AdminInput
                                            id={`conference-entry-add-name-${index}`}
                                            value={conferenceEntry.name}
                                            onChange={(event) =>
                                                updateAdditionalConferenceEntry(
                                                    index,
                                                    "name",
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Student"
                                        />
                                    </AdminFormField>

                                    <AdminFormField
                                        label="Cena"
                                        htmlFor={`conference-entry-add-price-${index}`}
                                        required
                                    >
                                        <AdminInput
                                            id={`conference-entry-add-price-${index}`}
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={conferenceEntry.price}
                                            onChange={(event) =>
                                                updateAdditionalConferenceEntry(
                                                    index,
                                                    "price",
                                                    event.target.value
                                                )
                                            }
                                            placeholder="100"
                                        />
                                    </AdminFormField>

                                    <div className="flex md:justify-end">
                                        <AdminIconButton
                                            icon={Trash2}
                                            label="Odstrániť nový riadok"
                                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                            onClick={() => removeAdditionalConferenceEntry(index)}
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