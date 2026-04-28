import {
    CheckCircle2,
    Clock,
    Copy,
    Download,
    Users,
} from "lucide-react";

import type { PublicDashboardContext } from "../../types/publicTypes.ts";

import {
    PublicAlert,
    PublicButton,
} from "../base/index.ts";

import { PaymentInstructions } from "./PaymentInstructions.tsx";

type GeneratedInvoicePanelProps = {
    dashboard: PublicDashboardContext;
};

export function GeneratedInvoicePanel({
                                          dashboard,
                                      }: GeneratedInvoicePanelProps) {
    const invoiceNumber = dashboard.invoice?.invoiceNumber ?? "—";
    const sharedCode = dashboard.invoice?.sharedCode ?? dashboard.sharedInvoiceCode;

    return (
        <div className="space-y-4">
            {sharedCode ? (
                <PublicAlert variant="info" icon={Users}>
                    <div className="space-y-2">
                        <p className="font-semibold">
                            Kód zdieľanej faktúry:
                        </p>

                        <div className="flex flex-wrap items-center gap-2">
                            <code className="rounded border bg-white px-3 py-2 font-mono text-base font-bold sm:text-lg">
                                {sharedCode}
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

            {dashboard.invoiceType === "join-shared" && dashboard.joinCode ? (
                <PublicAlert variant="success" icon={CheckCircle2}>
                    Úspešne ste sa pripojili k faktúre{" "}
                    <strong>{dashboard.joinCode}</strong>.
                </PublicAlert>
            ) : null}

            <PublicAlert
                variant={dashboard.invoiceStatus === "paid" ? "success" : "warning"}
                icon={dashboard.invoiceStatus === "paid" ? CheckCircle2 : Clock}
            >
                {dashboard.invoiceStatus === "paid" ? (
                    <>Faktúra bola zaplatená. Ďakujeme.</>
                ) : (
                    <>
                        Faktúra čaká na zaplatenie. Číslo faktúry:{" "}
                        <strong>{invoiceNumber}</strong>
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

            <PaymentInstructions dashboard={dashboard} />
        </div>
    );
}