import { useEffect, useState } from "react";

import {
    AdminButton,
    AdminCheckbox,
    AdminInput,
    AdminTextarea,
} from "../base/index.ts";

import {
    AdminDialog,
    AdminFormField,
    AdminFormGrid,
} from "../shared/index.ts";

import {
    ConferenceStatusValue,
    type ConferenceStatus,
} from "../../../../api/conferenceApi.ts";

import type { Conference } from "../../types/adminTypes.ts";

type EditConferenceDialogProps = {
    conference: Conference | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate: (
        id: number,
        input: {
            name: string;
            description: string;
            startDate: string;
            endDate: string;
            location: string;
            isPublished: boolean;
            status: ConferenceStatus;
        }
    ) => Promise<void>;
};

const conferenceStatusOptions: { value: ConferenceStatus; label: string }[] = [
    { value: ConferenceStatusValue.Preparation, label: "Príprava" },
    { value: ConferenceStatusValue.Active, label: "Aktívna" },
    { value: ConferenceStatusValue.Ended, label: "Ukončená" },
];

const normalizeConferenceStatus = (value: string): ConferenceStatus => {
    const numericValue = Number(value);

    if (
        numericValue === ConferenceStatusValue.Preparation ||
        numericValue === ConferenceStatusValue.Active ||
        numericValue === ConferenceStatusValue.Ended
    ) {
        return numericValue;
    }

    return ConferenceStatusValue.Preparation;
};

export function EditConferenceDialog({
                                         conference,
                                         open,
                                         onOpenChange,
                                         onUpdate,
                                     }: EditConferenceDialogProps) {
    const [form, setForm] = useState<Conference | null>(null);

    useEffect(() => {
        setForm(conference);
    }, [conference]);

    const handleSave = async () => {
        if (!form) {
            return;
        }

        await onUpdate(form.id, {
            name: form.name,
            description: form.description,
            startDate: form.startDate,
            endDate: form.endDate,
            location: form.location,
            isPublished: form.isPublished,
            status: form.status,
        });

        onOpenChange(false);
    };

    return (
        <AdminDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Upraviť konferenciu"
            description="Zmena základných informácií o konferencii."
            size="lg"
            footer={
                <>
                    <AdminButton variant="outline" onClick={() => onOpenChange(false)}>
                        Zrušiť
                    </AdminButton>

                    <AdminButton onClick={handleSave}>
                        Uložiť
                    </AdminButton>
                </>
            }
        >
            {form && (
                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <div className="space-y-4">
                        <AdminFormField
                            label="Názov konferencie"
                            htmlFor="edit-conference-name"
                            required
                        >
                            <AdminInput
                                id="edit-conference-name"
                                value={form.name}
                                onChange={(event) =>
                                    setForm({ ...form, name: event.target.value })
                                }
                            />
                        </AdminFormField>

                        <AdminFormField
                            label="Popis konferencie"
                            htmlFor="edit-conference-description"
                        >
                            <AdminTextarea
                                id="edit-conference-description"
                                value={form.description}
                                onChange={(event) =>
                                    setForm({ ...form, description: event.target.value })
                                }
                                rows={4}
                                className="min-h-28 resize-y"
                            />
                        </AdminFormField>

                        <AdminFormGrid columns={2}>
                            <AdminFormField
                                label="Dátum začiatku"
                                htmlFor="edit-conference-start"
                                required
                            >
                                <AdminInput
                                    id="edit-conference-start"
                                    type="date"
                                    value={form.startDate}
                                    onChange={(event) =>
                                        setForm({ ...form, startDate: event.target.value })
                                    }
                                />
                            </AdminFormField>

                            <AdminFormField
                                label="Dátum konca"
                                htmlFor="edit-conference-end"
                                required
                            >
                                <AdminInput
                                    id="edit-conference-end"
                                    type="date"
                                    value={form.endDate}
                                    onChange={(event) =>
                                        setForm({ ...form, endDate: event.target.value })
                                    }
                                />
                            </AdminFormField>
                        </AdminFormGrid>

                        <AdminFormField
                            label="Miesto konania"
                            htmlFor="edit-conference-location"
                        >
                            <AdminInput
                                id="edit-conference-location"
                                value={form.location}
                                onChange={(event) =>
                                    setForm({ ...form, location: event.target.value })
                                }
                            />
                        </AdminFormField>

                        <AdminFormGrid columns={2}>
                            <AdminFormField
                                label="Stav konferencie"
                                htmlFor="edit-conference-status"
                                required
                            >
                                <select
                                    id="edit-conference-status"
                                    value={String(form.status)}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            status: normalizeConferenceStatus(event.target.value),
                                        })
                                    }
                                    className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                >
                                    {conferenceStatusOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </AdminFormField>

                            <label
                                htmlFor="edit-conference-published"
                                className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800"
                            >
                                <AdminCheckbox
                                    id="edit-conference-published"
                                    checked={!!form.isPublished}
                                    onChange={(event) =>
                                        setForm({ ...form, isPublished: event.target.checked })
                                    }
                                />

                                Zverejnená používateľom
                            </label>
                        </AdminFormGrid>
                    </div>
                </div>
            )}
        </AdminDialog>
    );
}