import { useState } from "react";
import { toast } from "sonner";

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

type CreateConferenceDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreate: (input: {
        name: string;
        description: string;
        startDate: string;
        endDate: string;
        location: string;
        isPublished: boolean;
        status: ConferenceStatus;
    }) => Promise<void>;
};

const conferenceStatusOptions: { value: ConferenceStatus; label: string }[] = [
    { value: ConferenceStatusValue.Preparation, label: "Príprava" },
    { value: ConferenceStatusValue.Active, label: "Aktívna" },
    { value: ConferenceStatusValue.Ended, label: "Ukončená" },
];

const emptyForm = {
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    isPublished: false,
    status: ConferenceStatusValue.Preparation as ConferenceStatus,
};

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

export function CreateConferenceDialog({
                                           open,
                                           onOpenChange,
                                           onCreate,
                                       }: CreateConferenceDialogProps) {
    const [form, setForm] = useState(emptyForm);

    const handleClose = () => {
        setForm(emptyForm);
        onOpenChange(false);
    };

    const handleCreate = async () => {
        if (!form.name.trim() || !form.startDate || !form.endDate) {
            toast.error("Vyplň názov, začiatok a koniec konferencie.");
            return;
        }

        await onCreate({
            name: form.name.trim(),
            description: form.description.trim(),
            startDate: form.startDate,
            endDate: form.endDate,
            location: form.location.trim(),
            isPublished: form.isPublished,
            status: form.status,
        });

        setForm(emptyForm);
        onOpenChange(false);
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
            title="Vytvoriť novú konferenciu"
            description="Vyplň základné informácie. Ostatné nastavenia doplníš po vytvorení konferencie."
            size="lg"
            footer={
                <>
                    <AdminButton variant="outline" onClick={handleClose}>
                        Zrušiť
                    </AdminButton>

                    <AdminButton onClick={handleCreate}>
                        Vytvoriť
                    </AdminButton>
                </>
            }
        >
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="space-y-4">
                    <AdminFormField
                        label="Názov konferencie"
                        htmlFor="conference-name"
                        required
                    >
                        <AdminInput
                            id="conference-name"
                            value={form.name}
                            onChange={(event) =>
                                setForm({ ...form, name: event.target.value })
                            }
                            placeholder="Medzinárodná vedecká konferencia 2027"
                        />
                    </AdminFormField>

                    <AdminFormField
                        label="Popis konferencie"
                        htmlFor="conference-description"
                    >
                        <AdminTextarea
                            id="conference-description"
                            value={form.description}
                            onChange={(event) =>
                                setForm({ ...form, description: event.target.value })
                            }
                            placeholder="Spojenie najlepších vedeckých myslí z celého sveta"
                            rows={4}
                            className="min-h-28 resize-y"
                        />
                    </AdminFormField>

                    <AdminFormGrid columns={2}>
                        <AdminFormField
                            label="Dátum začiatku"
                            htmlFor="conference-start-date"
                            required
                        >
                            <AdminInput
                                id="conference-start-date"
                                type="date"
                                value={form.startDate}
                                onChange={(event) =>
                                    setForm({ ...form, startDate: event.target.value })
                                }
                            />
                        </AdminFormField>

                        <AdminFormField
                            label="Dátum konca"
                            htmlFor="conference-end-date"
                            required
                        >
                            <AdminInput
                                id="conference-end-date"
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
                        htmlFor="conference-location"
                    >
                        <AdminInput
                            id="conference-location"
                            value={form.location}
                            onChange={(event) =>
                                setForm({ ...form, location: event.target.value })
                            }
                            placeholder="Bratislava, Slovakia"
                        />
                    </AdminFormField>

                    <AdminFormGrid columns={2}>
                        <AdminFormField
                            label="Stav konferencie"
                            htmlFor="conference-status"
                            required
                        >
                            <select
                                id="conference-status"
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
                            htmlFor="conference-published"
                            className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800"
                        >
                            <AdminCheckbox
                                id="conference-published"
                                checked={form.isPublished}
                                onChange={(event) =>
                                    setForm({ ...form, isPublished: event.target.checked })
                                }
                            />

                            Zverejniť používateľom
                        </label>
                    </AdminFormGrid>

                    <p className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                        Publikovanie určuje, či sa konferencia zobrazí používateľom. Stav určuje, či je v príprave, aktívna alebo ukončená.
                    </p>
                </div>
            </div>
        </AdminDialog>
    );
}