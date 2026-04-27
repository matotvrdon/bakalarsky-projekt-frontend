import { CheckCircle2, Clock, Copy, Download, Users } from "lucide-react";

import type { PublicDashboardContext } from "../../types/publicTypes.ts";

import {
    PublicAlert,
    PublicButton,
    PublicCard,
    PublicInput,
    PublicLabel,
    PublicOptionCard,
    PublicTextarea,
} from "../base/index.ts";

type InvoiceTabProps = {
    dashboard: PublicDashboardContext;
};

export function InvoiceTab({ dashboard }: InvoiceTabProps) {
    return (
        <PublicCard
            title="Faktúra"
            description="Prehľad nákladov a vygenerovanie faktúry"
        >
            <div className="space-y-6">
                {!dashboard.invoiceGenerated ? (
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <PublicLabel className="text-base">
                                Typ faktúry
                            </PublicLabel>

                            <div className="space-y-3">
                                <PublicOptionCard
                                    htmlFor="individual"
                                    selected={dashboard.invoiceType === "individual"}
                                >
                                    <input
                                        id="individual"
                                        type="radio"
                                        name="invoiceType"
                                        value="individual"
                                        checked={
                                            dashboard.invoiceType === "individual"
                                        }
                                        onChange={() =>
                                            dashboard.setInvoiceType("individual")
                                        }
                                        className="mt-1 h-4 w-4"
                                    />

                                    <div className="flex-1">
                                        <PublicLabel
                                            htmlFor="individual"
                                            className="cursor-pointer"
                                        >
                                            Samostatná faktúra
                                        </PublicLabel>

                                        <p className="mt-1 text-sm text-gray-600">
                                            Faktúra len pre vás
                                        </p>
                                    </div>
                                </PublicOptionCard>

                                <PublicOptionCard
                                    htmlFor="create-shared"
                                    selected={
                                        dashboard.invoiceType === "create-shared"
                                    }
                                >
                                    <input
                                        id="create-shared"
                                        type="radio"
                                        name="invoiceType"
                                        value="create-shared"
                                        checked={
                                            dashboard.invoiceType ===
                                            "create-shared"
                                        }
                                        onChange={() =>
                                            dashboard.setInvoiceType(
                                                "create-shared"
                                            )
                                        }
                                        className="mt-1 h-4 w-4"
                                    />

                                    <div className="flex-1">
                                        <PublicLabel
                                            htmlFor="create-shared"
                                            className="flex cursor-pointer items-center gap-2"
                                        >
                                            <Users className="h-4 w-4" />
                                            Vytvoriť zdieľanú faktúru
                                        </PublicLabel>

                                        <p className="mt-1 text-sm text-gray-600">
                                            Vygenerujete kód, ktorý môžu použiť
                                            ostatní účastníci.
                                        </p>
                                    </div>
                                </PublicOptionCard>

                                <PublicOptionCard
                                    htmlFor="join-shared"
                                    selected={
                                        dashboard.invoiceType === "join-shared"
                                    }
                                >
                                    <input
                                        id="join-shared"
                                        type="radio"
                                        name="invoiceType"
                                        value="join-shared"
                                        checked={
                                            dashboard.invoiceType === "join-shared"
                                        }
                                        onChange={() =>
                                            dashboard.setInvoiceType("join-shared")
                                        }
                                        className="mt-1 h-4 w-4"
                                    />

                                    <div className="flex-1">
                                        <PublicLabel
                                            htmlFor="join-shared"
                                            className="cursor-pointer"
                                        >
                                            Pripojiť sa k zdieľanej faktúre
                                        </PublicLabel>

                                        <p className="mt-1 text-sm text-gray-600">
                                            Zadajte kód od iného účastníka.
                                        </p>
                                    </div>
                                </PublicOptionCard>
                            </div>
                        </div>

                        {dashboard.invoiceType === "join-shared" ? (
                            <div className="space-y-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
                                <PublicLabel htmlFor="joinCode">
                                    Zadajte kód zdieľanej faktúry
                                </PublicLabel>

                                <div className="flex gap-2">
                                    <PublicInput
                                        id="joinCode"
                                        value={dashboard.joinCode}
                                        onChange={(event) =>
                                            dashboard.setJoinCode(
                                                event.target.value.toUpperCase()
                                            )
                                        }
                                        placeholder="Napr. CONF-AB12CD"
                                        className="bg-white font-mono"
                                    />

                                    <PublicButton
                                        type="button"
                                        variant="outline"
                                        disabled={!dashboard.joinCode}
                                    >
                                        Pripojiť
                                    </PublicButton>
                                </div>

                                <p className="text-sm text-blue-700">
                                    Po pripojení sa vaše položky zarátajú do
                                    spoločnej faktúry.
                                </p>
                            </div>
                        ) : null}

                        <div className="space-y-3">
                            <label className="flex items-center gap-2">
                                <input
                                    id="customBilling"
                                    type="checkbox"
                                    checked={dashboard.hasCustomBilling}
                                    onChange={(event) =>
                                        dashboard.setHasCustomBilling(
                                            event.target.checked
                                        )
                                    }
                                    className="h-4 w-4"
                                />

                                <span className="cursor-pointer text-sm font-semibold text-gray-800">
                                    Zadať vlastné fakturačné údaje
                                </span>
                            </label>

                            {dashboard.hasCustomBilling ? (
                                <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                                    <div className="space-y-2">
                                        <PublicLabel htmlFor="companyName">
                                            Názov spoločnosti *
                                        </PublicLabel>

                                        <PublicInput
                                            id="companyName"
                                            value={dashboard.billingInfo.companyName}
                                            onChange={(event) =>
                                                dashboard.setBillingInfo({
                                                    ...dashboard.billingInfo,
                                                    companyName:
                                                    event.target.value,
                                                })
                                            }
                                            placeholder="Názov vašej spoločnosti"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <PublicLabel htmlFor="ico">
                                                IČO *
                                            </PublicLabel>

                                            <PublicInput
                                                id="ico"
                                                value={dashboard.billingInfo.ico}
                                                onChange={(event) =>
                                                    dashboard.setBillingInfo({
                                                        ...dashboard.billingInfo,
                                                        ico: event.target.value,
                                                    })
                                                }
                                                placeholder="12345678"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <PublicLabel htmlFor="dic">
                                                DIČ
                                            </PublicLabel>

                                            <PublicInput
                                                id="dic"
                                                value={dashboard.billingInfo.dic}
                                                onChange={(event) =>
                                                    dashboard.setBillingInfo({
                                                        ...dashboard.billingInfo,
                                                        dic: event.target.value,
                                                    })
                                                }
                                                placeholder="1234567890"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <PublicLabel htmlFor="address">
                                            Adresa *
                                        </PublicLabel>

                                        <PublicTextarea
                                            id="address"
                                            value={dashboard.billingInfo.address}
                                            onChange={(event) =>
                                                dashboard.setBillingInfo({
                                                    ...dashboard.billingInfo,
                                                    address: event.target.value,
                                                })
                                            }
                                            placeholder="Ulica 123, 811 01 Bratislava"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                ) : null}

                <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">
                        Súhrn nákladov
                    </h3>

                    <div className="space-y-2 text-sm">
                        {dashboard.selectedConferenceEntryId ? (
                            <div className="flex justify-between gap-4 border-b py-2">
                                <span>
                                    Registračný poplatok (
                                    {dashboard.summary.conferenceEntryLabel})
                                </span>

                                <span className="whitespace-nowrap font-semibold">
                                    {dashboard.selectedConferenceEntry?.price ?? 0} €
                                </span>
                            </div>
                        ) : null}

                        {dashboard.selectedAccommodation ? (
                            <div className="flex justify-between gap-4 border-b py-2">
                                <span className="break-words">
                                    {dashboard.selectedAccommodation.name}
                                </span>

                                <span className="whitespace-nowrap font-semibold">
                                    {dashboard.selectedAccommodation.price} €
                                </span>
                            </div>
                        ) : null}

                        {dashboard.catering.map((id) => {
                            const option = dashboard.cateringOptions.find(
                                (cateringOption) => cateringOption.id === id
                            );

                            if (!option) {
                                return null;
                            }

                            return (
                                <div
                                    key={id}
                                    className="flex justify-between gap-4 border-b py-2"
                                >
                                    <span className="break-words">
                                        {option.name}
                                    </span>

                                    <span className="whitespace-nowrap font-semibold">
                                        {option.price} €
                                    </span>
                                </div>
                            );
                        })}

                        <div className="flex justify-between border-t-2 py-3 text-base font-bold sm:text-lg">
                            <span>Celkom</span>
                            <span>{dashboard.total} €</span>
                        </div>
                    </div>
                </div>

                {!dashboard.invoiceGenerated ? (
                    <PublicButton
                        type="button"
                        className="w-full"
                        size="lg"
                        onClick={dashboard.handleGenerateInvoice}
                        disabled={
                            !dashboard.selectedConferenceEntryId ||
                            (dashboard.invoiceType === "join-shared" &&
                                !dashboard.joinCode)
                        }
                    >
                        Vygenerovať faktúru
                    </PublicButton>
                ) : (
                    <div className="space-y-4">
                        {dashboard.invoiceType === "create-shared" &&
                        dashboard.sharedInvoiceCode ? (
                            <PublicAlert variant="info" icon={Users}>
                                <div className="space-y-2">
                                    <p className="font-semibold">
                                        Kód zdieľanej faktúry:
                                    </p>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <code className="rounded border bg-white px-3 py-2 font-mono text-base font-bold sm:text-lg">
                                            {dashboard.sharedInvoiceCode}
                                        </code>

                                        <PublicButton
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={dashboard.copySharedInvoiceCode}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </PublicButton>
                                    </div>

                                    <p className="text-sm">
                                        Zdieľajte tento kód s ostatnými účastníkmi.
                                    </p>
                                </div>
                            </PublicAlert>
                        ) : null}

                        {dashboard.invoiceType === "join-shared" &&
                        dashboard.joinCode ? (
                            <PublicAlert variant="success" icon={CheckCircle2}>
                                Úspešne ste sa pripojili k faktúre{" "}
                                <strong>{dashboard.joinCode}</strong>.
                            </PublicAlert>
                        ) : null}

                        <PublicAlert
                            variant={
                                dashboard.invoiceStatus === "paid"
                                    ? "success"
                                    : "warning"
                            }
                            icon={
                                dashboard.invoiceStatus === "paid"
                                    ? CheckCircle2
                                    : Clock
                            }
                        >
                            {dashboard.invoiceStatus === "paid" ? (
                                <>Faktúra bola zaplatená. Ďakujeme!</>
                            ) : (
                                <>
                                    Faktúra čaká na zaplatenie. Číslo faktúry:{" "}
                                    <strong>INV-2026-001</strong>
                                </>
                            )}
                        </PublicAlert>

                        <PublicButton
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={dashboard.handleDownloadInvoice}
                        >
                            <Download className="h-4 w-4" />
                            Stiahnuť faktúru (PDF)
                        </PublicButton>

                        {dashboard.invoiceStatus === "pending" ? (
                            <div className="rounded-xl bg-gray-50 p-4 text-sm">
                                <h4 className="mb-2 font-semibold">
                                    Pokyny na zaplatenie:
                                </h4>

                                <p className="text-gray-600">
                                    Platbu prosím zašlite na účet:
                                    <br />
                                    <strong>SK31 1200 0000 1987 4263 7541</strong>
                                    <br />
                                    Variabilný symbol: <strong>2026001</strong>
                                    {dashboard.invoiceType === "create-shared" ? (
                                        <>
                                            <br />
                                            <br />
                                            <em>
                                                Pri zdieľanej faktúre platí celú
                                                sumu jeden účastník.
                                            </em>
                                        </>
                                    ) : null}
                                </p>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </PublicCard>
    );
}