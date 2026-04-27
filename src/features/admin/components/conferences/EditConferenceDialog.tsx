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
            isActive: boolean;
        }
    ) => Promise<void>;
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
            isActive: form.isActive,
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

                        <label
                            htmlFor="edit-conference-active"
                            className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800"
                        >
                            <AdminCheckbox
                                id="edit-conference-active"
                                checked={!!form.isActive}
                                onChange={(event) =>
                                    setForm({ ...form, isActive: event.target.checked })
                                }
                            />

                            Aktívna konferencia
                        </label>
                    </div>
                </div>
            )}
        </AdminDialog>
    );
}