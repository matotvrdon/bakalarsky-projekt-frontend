import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
    createConferenceBookingOptions,
    deleteConferenceBookingOption,
    updateConferenceBookingOption,
} from "../../../../api/conferenceApi.ts";

import type {
    BookingOptionCreateForm,
    BookingOptionUpdateForm,
    Conference,
} from "../../types/adminTypes.ts";

import {
    createEmptyBookingOptionForm,
    mapBookingOptionsToEditForm,
} from "../../utils/adminUtils.ts";

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

type BookingOptionsDialogProps = {
    conference: Conference | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSaved: () => Promise<void>;
};

export function BookingOptionsDialog({
                                         conference,
                                         open,
                                         onOpenChange,
                                         onSaved,
                                     }: BookingOptionsDialogProps) {
    const [editBookingOptions, setEditBookingOptions] = useState<
        BookingOptionUpdateForm[]
    >([]);

    const [additionalBookingOptions, setAdditionalBookingOptions] = useState<
        BookingOptionCreateForm[]
    >([]);

    useEffect(() => {
        if (!conference || !open) {
            return;
        }

        setEditBookingOptions(
            mapBookingOptionsToEditForm(conference.settings?.bookingOptions)
        );
        setAdditionalBookingOptions([]);
    }, [conference, open]);

    const hasRows = editBookingOptions.length > 0 || additionalBookingOptions.length > 0;

    const normalizedEditBookingOptions = useMemo(
        () =>
            editBookingOptions
                .map((bookingOption) => ({
                    id: bookingOption.id,
                    name: bookingOption.name.trim(),
                    description: bookingOption.description.trim(),
                    startDate: bookingOption.startDate,
                    endDate: bookingOption.endDate,
                    price: Number(bookingOption.price),
                }))
                .filter(
                    (bookingOption) =>
                        bookingOption.id > 0 &&
                        bookingOption.name.length > 0 &&
                        bookingOption.description.length > 0 &&
                        bookingOption.startDate.length > 0 &&
                        bookingOption.endDate.length > 0 &&
                        Number.isFinite(bookingOption.price)
                ),
        [editBookingOptions]
    );

    const normalizedAdditionalBookingOptions = useMemo(
        () =>
            additionalBookingOptions
                .map((bookingOption) => ({
                    name: bookingOption.name.trim(),
                    description: bookingOption.description.trim(),
                    startDate: bookingOption.startDate,
                    endDate: bookingOption.endDate,
                    price: Number(bookingOption.price),
                }))
                .filter(
                    (bookingOption) =>
                        bookingOption.name.length > 0 &&
                        bookingOption.description.length > 0 &&
                        bookingOption.startDate.length > 0 &&
                        bookingOption.endDate.length > 0 &&
                        Number.isFinite(bookingOption.price)
                ),
        [additionalBookingOptions]
    );

    const handleClose = () => {
        onOpenChange(false);
        setEditBookingOptions([]);
        setAdditionalBookingOptions([]);
    };

    const addAdditionalBookingOption = () => {
        setAdditionalBookingOptions((currentOptions) => [
            ...currentOptions,
            createEmptyBookingOptionForm(),
        ]);
    };

    const updateEditBookingOption = (
        index: number,
        field: keyof BookingOptionUpdateForm,
        value: string
    ) => {
        setEditBookingOptions((currentOptions) =>
            currentOptions.map((bookingOption, currentIndex) =>
                currentIndex === index
                    ? { ...bookingOption, [field]: value }
                    : bookingOption
            )
        );
    };

    const updateAdditionalBookingOption = (
        index: number,
        field: keyof BookingOptionCreateForm,
        value: string
    ) => {
        setAdditionalBookingOptions((currentOptions) =>
            currentOptions.map((bookingOption, currentIndex) =>
                currentIndex === index
                    ? { ...bookingOption, [field]: value }
                    : bookingOption
            )
        );
    };

    const removeAdditionalBookingOption = (index: number) => {
        setAdditionalBookingOptions((currentOptions) =>
            currentOptions.filter((_, currentIndex) => currentIndex !== index)
        );
    };

    const handleDeleteExistingBookingOption = async (bookingOptionId: number) => {
        if (!conference || bookingOptionId <= 0) {
            return;
        }

        try {
            await deleteConferenceBookingOption(conference.id, bookingOptionId);

            setEditBookingOptions((currentOptions) =>
                currentOptions.filter((bookingOption) => bookingOption.id !== bookingOptionId)
            );

            toast.success("Možnosť ubytovania bola vymazaná.");
            await onSaved();
        } catch (error) {
            console.error("Failed to delete booking option", error);
            toast.error("Vymazanie možnosti ubytovania zlyhalo.");
        }
    };

    const handleSave = async () => {
        if (!conference) {
            return;
        }

        try {
            if (normalizedEditBookingOptions.length > 0) {
                await Promise.all(
                    normalizedEditBookingOptions.map((bookingOption) =>
                        updateConferenceBookingOption(conference.id, bookingOption.id, bookingOption)
                    )
                );
            }

            if (normalizedAdditionalBookingOptions.length > 0) {
                await createConferenceBookingOptions(conference.id, {
                    bookingOptions: normalizedAdditionalBookingOptions,
                });
            }

            toast.success("Možnosti ubytovania boli upravené.");
            await onSaved();
            handleClose();
        } catch (error) {
            console.error("Failed to update booking options", error);
            toast.error("Úprava možností ubytovania zlyhala.");
        }
    };

    const renderBookingOptionRow = (
        bookingOption: BookingOptionUpdateForm | BookingOptionCreateForm,
        index: number,
        mode: "edit" | "add"
    ) => {
        const isEdit = mode === "edit";
        const rowId = isEdit ? `edit-${index}` : `add-${index}`;
        const rowClass = isEdit
            ? "border-gray-200 bg-gray-50/70"
            : "border-blue-100 bg-blue-50/60";

        return (
            <div
                key={rowId}
                className={`grid min-w-0 grid-cols-1 gap-4 rounded-xl border p-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_110px_150px_150px_44px] xl:items-start ${rowClass}`}
            >
                <AdminFormField
                    label="Názov"
                    htmlFor={`booking-option-${rowId}-name`}
                    required
                >
                    <AdminInput
                        id={`booking-option-${rowId}-name`}
                        value={bookingOption.name}
                        onChange={(event) =>
                            isEdit
                                ? updateEditBookingOption(index, "name", event.target.value)
                                : updateAdditionalBookingOption(index, "name", event.target.value)
                        }
                        placeholder="Hotel Tatra"
                    />
                </AdminFormField>

                <AdminFormField
                    label="Popis"
                    htmlFor={`booking-option-${rowId}-description`}
                    required
                >
                    <AdminTextarea
                        id={`booking-option-${rowId}-description`}
                        value={bookingOption.description}
                        onChange={(event) =>
                            isEdit
                                ? updateEditBookingOption(index, "description", event.target.value)
                                : updateAdditionalBookingOption(index, "description", event.target.value)
                        }
                        rows={3}
                        className="min-h-24 resize-y"
                        placeholder="Jednolôžková izba s raňajkami"
                    />
                </AdminFormField>

                <AdminFormField
                    label="Cena"
                    htmlFor={`booking-option-${rowId}-price`}
                    required
                >
                    <AdminInput
                        id={`booking-option-${rowId}-price`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={bookingOption.price}
                        onChange={(event) =>
                            isEdit
                                ? updateEditBookingOption(index, "price", event.target.value)
                                : updateAdditionalBookingOption(index, "price", event.target.value)
                        }
                        placeholder="80"
                    />
                </AdminFormField>

                <AdminFormField
                    label="Od"
                    htmlFor={`booking-option-${rowId}-start`}
                    required
                >
                    <AdminInput
                        id={`booking-option-${rowId}-start`}
                        type="date"
                        value={bookingOption.startDate}
                        onChange={(event) =>
                            isEdit
                                ? updateEditBookingOption(index, "startDate", event.target.value)
                                : updateAdditionalBookingOption(index, "startDate", event.target.value)
                        }
                    />
                </AdminFormField>

                <AdminFormField
                    label="Do"
                    htmlFor={`booking-option-${rowId}-end`}
                    required
                >
                    <AdminInput
                        id={`booking-option-${rowId}-end`}
                        type="date"
                        value={bookingOption.endDate}
                        onChange={(event) =>
                            isEdit
                                ? updateEditBookingOption(index, "endDate", event.target.value)
                                : updateAdditionalBookingOption(index, "endDate", event.target.value)
                        }
                    />
                </AdminFormField>

                <div className="flex items-end md:col-span-2 xl:col-span-1 xl:justify-end">
                    <AdminIconButton
                        icon={Trash2}
                        label={
                            isEdit
                                ? "Odstrániť existujúcu možnosť ubytovania"
                                : "Odstrániť nový riadok"
                        }
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() =>
                            isEdit
                                ? handleDeleteExistingBookingOption(
                                    (bookingOption as BookingOptionUpdateForm).id
                                )
                                : removeAdditionalBookingOption(index)
                        }
                    />
                </div>
            </div>
        );
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
            title="Správa ubytovacích možností"
            description={
                conference
                    ? `Ubytovanie pre konferenciu ${conference.name}`
                    : "Úprava ubytovania konferencie"
            }
            size="full"
            footer={
                <>
                    <AdminButton variant="outline" onClick={handleClose}>
                        Zrušiť
                    </AdminButton>

                    <AdminButton onClick={handleSave}>
                        Uložiť ubytovanie
                    </AdminButton>
                </>
            }
        >
            <div className="space-y-6">
                <AdminToolbar
                    description="Nastav ubytovacie možnosti pre účastníkov. Prázdne nové riadky sa pri ukladaní ignorujú."
                    actions={
                        <AdminButton
                            variant="outline"
                            onClick={addAdditionalBookingOption}
                            icon={<Plus className="h-4 w-4" />}
                        >
                            Pridať možnosť
                        </AdminButton>
                    }
                />

                {!hasRows ? (
                    <AdminEmptyState
                        title="Zatiaľ žiadne ubytovanie"
                        description="Pridaj prvú ubytovaciu možnosť pre účastníkov konferencie."
                        action={
                            <AdminButton
                                onClick={addAdditionalBookingOption}
                                icon={<Plus className="h-4 w-4" />}
                            >
                                Pridať možnosť
                            </AdminButton>
                        }
                    />
                ) : (
                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                        <div className="space-y-3">
                            {editBookingOptions.map((bookingOption, index) =>
                                renderBookingOptionRow(bookingOption, index, "edit")
                            )}

                            {additionalBookingOptions.map((bookingOption, index) =>
                                renderBookingOptionRow(bookingOption, index, "add")
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminDialog>
    );
}