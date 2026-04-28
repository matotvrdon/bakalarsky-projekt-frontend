import type { PublicDashboardContext } from "../../types/publicTypes.ts";

import {
    PublicInput,
    PublicLabel,
    PublicOptionCard,
} from "../base/index.ts";

type BillingInfoFormProps = {
    dashboard: PublicDashboardContext;
};

export function BillingInfoForm({
                                    dashboard,
                                }: BillingInfoFormProps) {
    if (dashboard.invoiceGenerated || dashboard.invoiceType === "join-shared") {
        return null;
    }

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                <PublicLabel className="text-base">
                    Fakturovať na
                </PublicLabel>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <PublicOptionCard
                        htmlFor="customerTypePerson"
                        selected={dashboard.billingInfo.customerType === "person"}
                    >
                        <input
                            id="customerTypePerson"
                            type="radio"
                            name="customerType"
                            checked={dashboard.billingInfo.customerType === "person"}
                            onChange={() =>
                                dashboard.setBillingInfo({
                                    ...dashboard.billingInfo,
                                    customerType: "person",
                                })
                            }
                            className="mt-1 h-4 w-4"
                        />

                        <div>
                            <div className="font-semibold text-gray-900">
                                Osobu
                            </div>

                            <p className="mt-1 text-sm text-gray-600">
                                Faktúra bude vystavená na meno účastníka.
                            </p>
                        </div>
                    </PublicOptionCard>

                    <PublicOptionCard
                        htmlFor="customerTypeCompany"
                        selected={dashboard.billingInfo.customerType === "company"}
                    >
                        <input
                            id="customerTypeCompany"
                            type="radio"
                            name="customerType"
                            checked={dashboard.billingInfo.customerType === "company"}
                            onChange={() =>
                                dashboard.setBillingInfo({
                                    ...dashboard.billingInfo,
                                    customerType: "company",
                                })
                            }
                            className="mt-1 h-4 w-4"
                        />

                        <div>
                            <div className="font-semibold text-gray-900">
                                Firmu
                            </div>

                            <p className="mt-1 text-sm text-gray-600">
                                Potrebný je názov firmy, sídlo a IČO.
                            </p>
                        </div>
                    </PublicOptionCard>
                </div>
            </div>

            <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                {dashboard.billingInfo.customerType === "person" ? (
                    <div className="space-y-2">
                        <PublicLabel htmlFor="customerName">
                            Meno a priezvisko *
                        </PublicLabel>

                        <PublicInput
                            id="customerName"
                            value={dashboard.billingInfo.customerName}
                            onChange={(event) =>
                                dashboard.setBillingInfo({
                                    ...dashboard.billingInfo,
                                    customerName: event.target.value,
                                })
                            }
                            placeholder="Meno a priezvisko"
                        />
                    </div>
                ) : null}

                {dashboard.billingInfo.customerType === "company" ? (
                    <>
                        <div className="space-y-2">
                            <PublicLabel htmlFor="companyName">
                                Názov firmy *
                            </PublicLabel>

                            <PublicInput
                                id="companyName"
                                value={dashboard.billingInfo.companyName}
                                onChange={(event) =>
                                    dashboard.setBillingInfo({
                                        ...dashboard.billingInfo,
                                        companyName: event.target.value,
                                    })
                                }
                                placeholder="Názov firmy"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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

                            <div className="space-y-2">
                                <PublicLabel htmlFor="vatId">
                                    IČ DPH
                                </PublicLabel>

                                <PublicInput
                                    id="vatId"
                                    value={dashboard.billingInfo.vatId}
                                    onChange={(event) =>
                                        dashboard.setBillingInfo({
                                            ...dashboard.billingInfo,
                                            vatId: event.target.value,
                                        })
                                    }
                                    placeholder="SK1234567890"
                                />
                            </div>
                        </div>
                    </>
                ) : null}

                <div className="space-y-3">
                    <PublicLabel className="text-base">
                        Fakturačná adresa
                    </PublicLabel>

                    <div className="space-y-2">
                        <PublicLabel htmlFor="billingStreet">
                            Ulica a číslo *
                        </PublicLabel>

                        <PublicInput
                            id="billingStreet"
                            value={dashboard.billingInfo.street}
                            onChange={(event) =>
                                dashboard.setBillingInfo({
                                    ...dashboard.billingInfo,
                                    street: event.target.value,
                                })
                            }
                            placeholder="Napr. Hlavná 1"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <PublicLabel htmlFor="billingPostalCode">
                                PSČ *
                            </PublicLabel>

                            <PublicInput
                                id="billingPostalCode"
                                value={dashboard.billingInfo.postalCode}
                                onChange={(event) =>
                                    dashboard.setBillingInfo({
                                        ...dashboard.billingInfo,
                                        postalCode: event.target.value,
                                    })
                                }
                                placeholder="040 01"
                            />
                        </div>

                        <div className="space-y-2">
                            <PublicLabel htmlFor="billingCity">
                                Mesto *
                            </PublicLabel>

                            <PublicInput
                                id="billingCity"
                                value={dashboard.billingInfo.city}
                                onChange={(event) =>
                                    dashboard.setBillingInfo({
                                        ...dashboard.billingInfo,
                                        city: event.target.value,
                                    })
                                }
                                placeholder="Košice"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <PublicLabel htmlFor="billingCountry">
                            Štát *
                        </PublicLabel>

                        <PublicInput
                            id="billingCountry"
                            value={dashboard.billingInfo.country}
                            onChange={(event) =>
                                dashboard.setBillingInfo({
                                    ...dashboard.billingInfo,
                                    country: event.target.value,
                                })
                            }
                            placeholder="Slovensko"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}