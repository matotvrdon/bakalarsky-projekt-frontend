import { useEffect, useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
    deleteSubmissionSettingsByConference,
    getSubmissionSettingsByConference,
    updateSubmissionSettingsByConference,
    type SubmissionSettings,
    type SubmissionSettingsUpdateRequest,
} from "../../../../api/submissionSettingsApi.ts";

import type { Conference } from "../../types/adminTypes.ts";

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
    AdminToolbar,
} from "../shared/index.ts";

type SubmissionSettingsDialogProps = {
    conference: Conference | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSaved: () => void | Promise<void>;
};

type SubmissionSettingsForm = {
    ieeePdfExpressUrl: string;
    easyChairUrl: string;
    conferenceCode: string;
    finalPaperDeadline: string;

    ieeeTemplateUrl: string;
    latexExample: string;

    maxPages: string;
    extraPagePrice: string;
    abstractMinWords: string;

    isEnabled: boolean;
};

const createEmptyForm = (): SubmissionSettingsForm => ({
    ieeePdfExpressUrl: "",
    easyChairUrl: "",
    conferenceCode: "",
    finalPaperDeadline: "",

    ieeeTemplateUrl: "",
    latexExample: "\\documentclass[conference, a4paper]{IEEEtran}",

    maxPages: "6",
    extraPagePrice: "10",
    abstractMinWords: "150",

    isEnabled: true,
});

const formatDateInput = (value?: string | null) => {
    if (!value) {
        return "";
    }

    return value.slice(0, 10);
};

const mapSettingsToForm = (
    settings: SubmissionSettings | null
): SubmissionSettingsForm => {
    if (!settings) {
        return createEmptyForm();
    }

    return {
        ieeePdfExpressUrl: settings.ieeePdfExpressUrl ?? "",
        easyChairUrl: settings.easyChairUrl ?? "",
        conferenceCode: settings.conferenceCode ?? "",
        finalPaperDeadline: formatDateInput(settings.finalPaperDeadline),

        ieeeTemplateUrl: settings.ieeeTemplateUrl ?? "",
        latexExample:
            settings.latexExample ??
            "\\documentclass[conference, a4paper]{IEEEtran}",

        maxPages: String(settings.maxPages ?? 6),
        extraPagePrice: String(settings.extraPagePrice ?? 10),
        abstractMinWords: String(settings.abstractMinWords ?? 150),

        isEnabled: settings.isEnabled ?? true,
    };
};

const parseRequiredInt = (value: string, fallback: number) => {
    const parsed = Number.parseInt(value, 10);

    if (!Number.isFinite(parsed)) {
        return fallback;
    }

    return parsed;
};

const parseRequiredDecimal = (value: string, fallback: number) => {
    const parsed = Number.parseFloat(value.replace(",", "."));

    if (!Number.isFinite(parsed)) {
        return fallback;
    }

    return parsed;
};

const normalizeOptionalString = (value: string) => {
    const trimmed = value.trim();

    return trimmed.length > 0 ? trimmed : null;
};

export function SubmissionSettingsDialog({
                                             conference,
                                             open,
                                             onOpenChange,
                                             onSaved,
                                         }: SubmissionSettingsDialogProps) {
    const [form, setForm] = useState<SubmissionSettingsForm>(createEmptyForm);
    const [loading, setLoading] = useState(false);
    const [hasExistingSettings, setHasExistingSettings] = useState(false);

    useEffect(() => {
        if (!conference || !open) {
            return;
        }

        loadSubmissionSettings(conference.id);
    }, [conference, open]);

    const loadSubmissionSettings = async (conferenceId: number) => {
        try {
            setLoading(true);

            const settings = await getSubmissionSettingsByConference(conferenceId);

            setHasExistingSettings(settings !== null);
            setForm(mapSettingsToForm(settings));
        } catch (error) {
            console.error("Failed to load submission settings", error);
            toast.error("Načítanie nastavení príspevkov zlyhalo.");
            setHasExistingSettings(false);
            setForm(createEmptyForm());
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setForm(createEmptyForm());
        setHasExistingSettings(false);
        onOpenChange(false);
    };

    const updateField = (
        field: keyof SubmissionSettingsForm,
        value: string | boolean
    ) => {
        setForm((currentForm) => ({
            ...currentForm,
            [field]: value,
        }));
    };

    const buildPayload = (): SubmissionSettingsUpdateRequest => ({
        ieeePdfExpressUrl: normalizeOptionalString(form.ieeePdfExpressUrl),
        easyChairUrl: normalizeOptionalString(form.easyChairUrl),
        conferenceCode: normalizeOptionalString(form.conferenceCode),
        finalPaperDeadline: normalizeOptionalString(form.finalPaperDeadline),

        ieeeTemplateUrl: normalizeOptionalString(form.ieeeTemplateUrl),
        latexExample: normalizeOptionalString(form.latexExample),

        maxPages: parseRequiredInt(form.maxPages, 6),
        extraPagePrice: parseRequiredDecimal(form.extraPagePrice, 10),
        abstractMinWords: parseRequiredInt(form.abstractMinWords, 150),

        isEnabled: form.isEnabled,
    });

    const validateForm = () => {
        const maxPages = parseRequiredInt(form.maxPages, 0);
        const extraPagePrice = parseRequiredDecimal(form.extraPagePrice, -1);
        const abstractMinWords = parseRequiredInt(form.abstractMinWords, 0);

        if (maxPages <= 0) {
            toast.error("Maximálny počet strán musí byť väčší ako 0.");
            return false;
        }

        if (extraPagePrice < 0) {
            toast.error("Cena za extra stranu nemôže byť záporná.");
            return false;
        }

        if (abstractMinWords <= 0) {
            toast.error("Minimálny počet slov abstraktu musí byť väčší ako 0.");
            return false;
        }

        return true;
    };

    const handleSave = async () => {
        if (!conference) {
            return;
        }

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            await updateSubmissionSettingsByConference(
                conference.id,
                buildPayload()
            );

            toast.success("Nastavenia príspevkov boli uložené.");
            await onSaved();
            handleClose();
        } catch (error) {
            console.error("Failed to save submission settings", error);
            toast.error("Uloženie nastavení príspevkov zlyhalo.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!conference) {
            return;
        }

        try {
            setLoading(true);

            await deleteSubmissionSettingsByConference(conference.id);

            toast.success("Nastavenia príspevkov boli odstránené.");
            await onSaved();
            handleClose();
        } catch (error) {
            console.error("Failed to delete submission settings", error);
            toast.error("Odstránenie nastavení príspevkov zlyhalo.");
        } finally {
            setLoading(false);
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
            title="Nastavenia príspevkov"
            description={
                conference
                    ? `Konfigurácia stránky Príspevky pre konferenciu ${conference.name}`
                    : "Konfigurácia stránky Príspevky"
            }
            size="lg"
            footer={
                <>
                    {hasExistingSettings ? (
                        <AdminButton
                            variant="danger"
                            onClick={handleDelete}
                            disabled={loading}
                            icon={<Trash2 className="h-4 w-4" />}
                        >
                            Odstrániť
                        </AdminButton>
                    ) : null}

                    <div className="flex flex-1 justify-end gap-3">
                        <AdminButton
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Zrušiť
                        </AdminButton>

                        <AdminButton
                            onClick={handleSave}
                            disabled={loading}
                            icon={<Save className="h-4 w-4" />}
                        >
                            Uložiť nastavenia
                        </AdminButton>
                    </div>
                </>
            }
        >
            <div className="space-y-6">
                <AdminToolbar
                    description="Tieto hodnoty sa používajú na verejnej stránke Príspevky. Prázdne URL sa zobrazia iba ako obyčajný text bez odkazu."
                />

                {loading ? (
                    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-8 text-center text-sm text-gray-600">
                        Načítavam nastavenia príspevkov...
                    </div>
                ) : null}

                {!loading ? (
                    <>
                        <div className="rounded-2xl border border-gray-200 bg-white p-5">
                            <h3 className="mb-4 text-base font-bold text-gray-900">
                                Finálny príspevok
                            </h3>

                            <AdminFormGrid columns={2}>
                                <AdminFormField
                                    label="IEEE PDF eXpress URL"
                                    htmlFor="submission-ieee-pdf-express-url"
                                >
                                    <AdminInput
                                        id="submission-ieee-pdf-express-url"
                                        value={form.ieeePdfExpressUrl}
                                        onChange={(event) =>
                                            updateField(
                                                "ieeePdfExpressUrl",
                                                event.target.value
                                            )
                                        }
                                        placeholder="https://ieee-pdf-express.org"
                                    />
                                </AdminFormField>

                                <AdminFormField
                                    label="EasyChair URL"
                                    htmlFor="submission-easy-chair-url"
                                >
                                    <AdminInput
                                        id="submission-easy-chair-url"
                                        value={form.easyChairUrl}
                                        onChange={(event) =>
                                            updateField(
                                                "easyChairUrl",
                                                event.target.value
                                            )
                                        }
                                        placeholder="https://easychair.org/..."
                                    />
                                </AdminFormField>

                                <AdminFormField
                                    label="Conference ID / kód"
                                    htmlFor="submission-conference-code"
                                >
                                    <AdminInput
                                        id="submission-conference-code"
                                        value={form.conferenceCode}
                                        onChange={(event) =>
                                            updateField(
                                                "conferenceCode",
                                                event.target.value
                                            )
                                        }
                                        placeholder="622MM"
                                    />
                                </AdminFormField>

                                <AdminFormField
                                    label="Deadline finálneho príspevku"
                                    htmlFor="submission-final-paper-deadline"
                                >
                                    <AdminInput
                                        id="submission-final-paper-deadline"
                                        type="date"
                                        value={form.finalPaperDeadline}
                                        onChange={(event) =>
                                            updateField(
                                                "finalPaperDeadline",
                                                event.target.value
                                            )
                                        }
                                    />
                                </AdminFormField>
                            </AdminFormGrid>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5">
                            <h3 className="mb-4 text-base font-bold text-gray-900">
                                Príprava príspevku
                            </h3>

                            <AdminFormGrid columns={3}>
                                <AdminFormField
                                    label="Maximálny počet strán"
                                    htmlFor="submission-max-pages"
                                    required
                                >
                                    <AdminInput
                                        id="submission-max-pages"
                                        type="number"
                                        min={1}
                                        value={form.maxPages}
                                        onChange={(event) =>
                                            updateField(
                                                "maxPages",
                                                event.target.value
                                            )
                                        }
                                    />
                                </AdminFormField>

                                <AdminFormField
                                    label="Cena za extra stranu"
                                    htmlFor="submission-extra-page-price"
                                    required
                                >
                                    <AdminInput
                                        id="submission-extra-page-price"
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        value={form.extraPagePrice}
                                        onChange={(event) =>
                                            updateField(
                                                "extraPagePrice",
                                                event.target.value
                                            )
                                        }
                                    />
                                </AdminFormField>

                                <AdminFormField
                                    label="Min. počet slov abstraktu"
                                    htmlFor="submission-abstract-min-words"
                                    required
                                >
                                    <AdminInput
                                        id="submission-abstract-min-words"
                                        type="number"
                                        min={1}
                                        value={form.abstractMinWords}
                                        onChange={(event) =>
                                            updateField(
                                                "abstractMinWords",
                                                event.target.value
                                            )
                                        }
                                    />
                                </AdminFormField>
                            </AdminFormGrid>

                            <div className="mt-4 space-y-4">
                                <AdminFormField
                                    label="IEEE template URL"
                                    htmlFor="submission-ieee-template-url"
                                >
                                    <AdminInput
                                        id="submission-ieee-template-url"
                                        value={form.ieeeTemplateUrl}
                                        onChange={(event) =>
                                            updateField(
                                                "ieeeTemplateUrl",
                                                event.target.value
                                            )
                                        }
                                        placeholder="https://www.ieee.org/..."
                                    />
                                </AdminFormField>

                                <AdminFormField
                                    label="LaTeX príklad"
                                    htmlFor="submission-latex-example"
                                >
                                    <AdminTextarea
                                        id="submission-latex-example"
                                        value={form.latexExample}
                                        onChange={(event) =>
                                            updateField(
                                                "latexExample",
                                                event.target.value
                                            )
                                        }
                                        rows={3}
                                        className="font-mono"
                                    />
                                </AdminFormField>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5">
                            <label
                                htmlFor="submission-is-enabled"
                                className="flex items-start gap-3"
                            >
                                <AdminCheckbox
                                    id="submission-is-enabled"
                                    checked={form.isEnabled}
                                    onChange={(event) =>
                                        updateField(
                                            "isEnabled",
                                            event.target.checked
                                        )
                                    }
                                />

                                <span>
                                    <span className="block text-sm font-semibold text-gray-900">
                                        Zobraziť nastavenia príspevkov na verejnej stránke
                                    </span>

                                    <span className="mt-1 block text-sm text-gray-600">
                                        Ak je vypnuté, backend aktívne nastavenia pre stránku Príspevky nevráti.
                                    </span>
                                </span>
                            </label>
                        </div>
                    </>
                ) : null}
            </div>
        </AdminDialog>
    );
}