import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
    createConferenceFoodOptions,
    deleteConferenceFoodOption,
    updateConferenceFoodOption,
    type FoodOptionType,
} from "../../../../app/api/conferenceApi.ts";

import type {
    Conference,
    FoodOptionCreateForm,
    FoodOptionUpdateForm,
} from "../../types/adminTypes.ts";

import {
    createEmptyFoodOptionForm,
    mapFoodOptionsToEditForm,
    normalizeFoodOptionType,
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

type FoodOptionsDialogProps = {
    conference: Conference | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSaved: () => Promise<void>;
};

const foodOptionTypeOptions: { value: FoodOptionType; label: string }[] = [
    { value: 0, label: "Raňajky" },
    { value: 1, label: "Obed" },
    { value: 2, label: "Večera" },
];

export function FoodOptionsDialog({
                                      conference,
                                      open,
                                      onOpenChange,
                                      onSaved,
                                  }: FoodOptionsDialogProps) {
    const [editFoodOptions, setEditFoodOptions] = useState<FoodOptionUpdateForm[]>([]);
    const [additionalFoodOptions, setAdditionalFoodOptions] = useState<FoodOptionCreateForm[]>([]);

    useEffect(() => {
        if (!conference || !open) {
            return;
        }

        setEditFoodOptions(mapFoodOptionsToEditForm(conference.settings?.foodOptions));
        setAdditionalFoodOptions([]);
    }, [conference, open]);

    const hasRows = editFoodOptions.length > 0 || additionalFoodOptions.length > 0;

    const normalizedEditFoodOptions = useMemo(
        () =>
            editFoodOptions
                .map((foodOption) => ({
                    id: foodOption.id,
                    name: foodOption.name.trim(),
                    description: foodOption.description.trim(),
                    date: foodOption.date,
                    price: Number(foodOption.price),
                    foodOptionsType: foodOption.foodOptionsType,
                }))
                .filter(
                    (foodOption) =>
                        foodOption.id > 0 &&
                        foodOption.name.length > 0 &&
                        foodOption.description.length > 0 &&
                        foodOption.date.length > 0 &&
                        Number.isFinite(foodOption.price)
                ),
        [editFoodOptions]
    );

    const normalizedAdditionalFoodOptions = useMemo(
        () =>
            additionalFoodOptions
                .map((foodOption) => ({
                    name: foodOption.name.trim(),
                    description: foodOption.description.trim(),
                    date: foodOption.date,
                    price: Number(foodOption.price),
                    foodOptionsType: foodOption.foodOptionsType,
                }))
                .filter(
                    (foodOption) =>
                        foodOption.name.length > 0 &&
                        foodOption.description.length > 0 &&
                        foodOption.date.length > 0 &&
                        Number.isFinite(foodOption.price)
                ),
        [additionalFoodOptions]
    );

    const handleClose = () => {
        onOpenChange(false);
        setEditFoodOptions([]);
        setAdditionalFoodOptions([]);
    };

    const addAdditionalFoodOption = () => {
        setAdditionalFoodOptions((currentOptions) => [
            ...currentOptions,
            createEmptyFoodOptionForm(),
        ]);
    };

    const updateEditFoodOption = (
        index: number,
        field: keyof FoodOptionUpdateForm,
        value: string | FoodOptionType
    ) => {
        setEditFoodOptions((currentOptions) =>
            currentOptions.map((foodOption, currentIndex) =>
                currentIndex === index
                    ? { ...foodOption, [field]: value }
                    : foodOption
            )
        );
    };

    const updateAdditionalFoodOption = (
        index: number,
        field: keyof FoodOptionCreateForm,
        value: string | FoodOptionType
    ) => {
        setAdditionalFoodOptions((currentOptions) =>
            currentOptions.map((foodOption, currentIndex) =>
                currentIndex === index
                    ? { ...foodOption, [field]: value }
                    : foodOption
            )
        );
    };

    const removeAdditionalFoodOption = (index: number) => {
        setAdditionalFoodOptions((currentOptions) =>
            currentOptions.filter((_, currentIndex) => currentIndex !== index)
        );
    };

    const handleDeleteExistingFoodOption = async (foodOptionId: number) => {
        if (!conference || foodOptionId <= 0) {
            return;
        }

        try {
            await deleteConferenceFoodOption(conference.id, foodOptionId);

            setEditFoodOptions((currentOptions) =>
                currentOptions.filter((foodOption) => foodOption.id !== foodOptionId)
            );

            toast.success("Stravovacia možnosť bola vymazaná.");
            await onSaved();
        } catch (error) {
            console.error("Failed to delete food option", error);
            toast.error("Vymazanie stravovacej možnosti zlyhalo.");
        }
    };

    const handleSave = async () => {
        if (!conference) {
            return;
        }

        try {
            if (normalizedEditFoodOptions.length > 0) {
                await Promise.all(
                    normalizedEditFoodOptions.map((foodOption) =>
                        updateConferenceFoodOption(conference.id, foodOption.id, foodOption)
                    )
                );
            }

            if (normalizedAdditionalFoodOptions.length > 0) {
                await createConferenceFoodOptions(conference.id, {
                    foodOptions: normalizedAdditionalFoodOptions,
                });
            }

            toast.success("Stravovacie možnosti boli upravené.");
            await onSaved();
            handleClose();
        } catch (error) {
            console.error("Failed to update food options", error);
            toast.error("Úprava stravovacích možností zlyhala.");
        }
    };

    const renderFoodOptionRow = (
        foodOption: FoodOptionUpdateForm | FoodOptionCreateForm,
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
                className={`grid min-w-0 grid-cols-1 gap-4 rounded-xl border p-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_130px_110px_150px_44px] xl:items-start ${rowClass}`}
            >
                <AdminFormField
                    label="Názov"
                    htmlFor={`food-option-${rowId}-name`}
                    required
                >
                    <AdminInput
                        id={`food-option-${rowId}-name`}
                        value={foodOption.name}
                        onChange={(event) =>
                            isEdit
                                ? updateEditFoodOption(index, "name", event.target.value)
                                : updateAdditionalFoodOption(index, "name", event.target.value)
                        }
                        placeholder="Obed"
                    />
                </AdminFormField>

                <AdminFormField
                    label="Popis"
                    htmlFor={`food-option-${rowId}-description`}
                    required
                >
                    <AdminTextarea
                        id={`food-option-${rowId}-description`}
                        value={foodOption.description}
                        onChange={(event) =>
                            isEdit
                                ? updateEditFoodOption(index, "description", event.target.value)
                                : updateAdditionalFoodOption(index, "description", event.target.value)
                        }
                        rows={3}
                        className="min-h-24 resize-y"
                        placeholder="Denné menu v hoteli"
                    />
                </AdminFormField>

                <AdminFormField
                    label="Typ"
                    htmlFor={`food-option-${rowId}-type`}
                    required
                >
                    <select
                        id={`food-option-${rowId}-type`}
                        value={String(foodOption.foodOptionsType)}
                        onChange={(event) =>
                            isEdit
                                ? updateEditFoodOption(
                                    index,
                                    "foodOptionsType",
                                    normalizeFoodOptionType(event.target.value)
                                )
                                : updateAdditionalFoodOption(
                                    index,
                                    "foodOptionsType",
                                    normalizeFoodOptionType(event.target.value)
                                )
                        }
                        className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                        {foodOptionTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </AdminFormField>

                <AdminFormField
                    label="Cena"
                    htmlFor={`food-option-${rowId}-price`}
                    required
                >
                    <AdminInput
                        id={`food-option-${rowId}-price`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={foodOption.price}
                        onChange={(event) =>
                            isEdit
                                ? updateEditFoodOption(index, "price", event.target.value)
                                : updateAdditionalFoodOption(index, "price", event.target.value)
                        }
                        placeholder="15"
                    />
                </AdminFormField>

                <AdminFormField
                    label="Dátum"
                    htmlFor={`food-option-${rowId}-date`}
                    required
                >
                    <AdminInput
                        id={`food-option-${rowId}-date`}
                        type="date"
                        value={foodOption.date}
                        onChange={(event) =>
                            isEdit
                                ? updateEditFoodOption(index, "date", event.target.value)
                                : updateAdditionalFoodOption(index, "date", event.target.value)
                        }
                    />
                </AdminFormField>

                <div className="flex items-end md:col-span-2 xl:col-span-1 xl:justify-end">
                    <AdminIconButton
                        icon={Trash2}
                        label={
                            isEdit
                                ? "Odstrániť existujúcu stravovaciu možnosť"
                                : "Odstrániť nový riadok"
                        }
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() =>
                            isEdit
                                ? handleDeleteExistingFoodOption((foodOption as FoodOptionUpdateForm).id)
                                : removeAdditionalFoodOption(index)
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
            title="Správa stravovacích možností"
            description={
                conference
                    ? `Stravovanie pre konferenciu ${conference.name}`
                    : "Úprava stravovania konferencie"
            }
            size="full"
            footer={
                <>
                    <AdminButton variant="outline" onClick={handleClose}>
                        Zrušiť
                    </AdminButton>

                    <AdminButton onClick={handleSave}>
                        Uložiť stravu
                    </AdminButton>
                </>
            }
        >
            <div className="space-y-6">
                <AdminToolbar
                    description="Nastav stravovacie možnosti pre účastníkov. Prázdne nové riadky sa pri ukladaní ignorujú."
                    actions={
                        <AdminButton
                            variant="outline"
                            onClick={addAdditionalFoodOption}
                            icon={<Plus className="h-4 w-4" />}
                        >
                            Pridať možnosť
                        </AdminButton>
                    }
                />

                {!hasRows ? (
                    <AdminEmptyState
                        title="Zatiaľ žiadne stravovanie"
                        description="Pridaj prvú stravovaciu možnosť, napríklad obed alebo večeru."
                        action={
                            <AdminButton
                                onClick={addAdditionalFoodOption}
                                icon={<Plus className="h-4 w-4" />}
                            >
                                Pridať možnosť
                            </AdminButton>
                        }
                    />
                ) : (
                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                        <div className="space-y-3">
                            {editFoodOptions.map((foodOption, index) =>
                                renderFoodOptionRow(foodOption, index, "edit")
                            )}

                            {additionalFoodOptions.map((foodOption, index) =>
                                renderFoodOptionRow(foodOption, index, "add")
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminDialog>
    );
}