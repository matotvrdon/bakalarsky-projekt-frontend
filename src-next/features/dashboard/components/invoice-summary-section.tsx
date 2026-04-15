import { CheckCircle2, Copy, Download, Users } from "lucide-react";

import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../shared/ui";

type SummaryLine = {
  id: string;
  label: string;
  value: number;
};

type InvoiceSummarySectionProps = {
  lines: SummaryLine[];
  total: number;
  invoiceGenerated: boolean;
  invoiceStatus: "pending" | "paid";
  invoiceNumber?: string;
  sharedInvoiceCode?: string;
  isSharedCreator?: boolean;
  joinedCode?: string;
  onGenerate: () => void;
  onDownload: () => void;
};

export function InvoiceSummarySection({
  lines,
  total,
  invoiceGenerated,
  invoiceStatus,
  invoiceNumber,
  sharedInvoiceCode,
  isSharedCreator,
  joinedCode,
  onGenerate,
  onDownload,
}: InvoiceSummarySectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Faktúra</CardTitle>
        <CardDescription>Prehľad nákladov a vygenerovanie faktúry.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-sm">
          {lines.map((line) => (
            <div key={line.id} className="flex justify-between border-b py-2">
              <span>{line.label}</span>
              <span className="font-semibold">{line.value.toFixed(2)} €</span>
            </div>
          ))}
          <div className="flex justify-between border-t-2 py-3 text-base font-bold">
            <span>Celkom</span>
            <span>{total.toFixed(2)} €</span>
          </div>
        </div>

        {!invoiceGenerated ? (
          <Button onClick={onGenerate} className="w-full" size="lg" disabled={lines.length === 0}>
            Vygenerovať faktúru
          </Button>
        ) : (
          <div className="flex flex-col gap-4">
            {isSharedCreator && sharedInvoiceCode ? (
              <Alert className="border-blue-200 bg-blue-50">
                <Users className="text-blue-600" />
                <AlertDescription className="text-blue-900">
                  <p className="font-semibold">Kód zdieľanej faktúry</p>
                  <div className="mt-2 flex items-center gap-2">
                    <code className="rounded border bg-white px-3 py-2 font-mono text-base">{sharedInvoiceCode}</code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigator.clipboard.writeText(sharedInvoiceCode)}
                    >
                      <Copy data-icon="inline-start" />
                      Kopírovať
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            ) : null}

            {joinedCode ? (
              <Alert className="border-emerald-200 bg-emerald-50">
                <CheckCircle2 className="text-emerald-600" />
                <AlertDescription className="text-emerald-900">
                  Pripojené k zdieľanej faktúre <strong>{joinedCode}</strong>.
                </AlertDescription>
              </Alert>
            ) : null}

            {invoiceStatus === "paid" ? (
              <Badge className="bg-green-600">Zaplatené</Badge>
            ) : (
              <Badge variant="outline" className="border-yellow-500 text-yellow-700">Čaká na zaplatenie</Badge>
            )}

            <Alert className={invoiceStatus === "paid" ? "border-emerald-200 bg-emerald-50" : "border-yellow-200 bg-yellow-50"}>
              <AlertDescription>
                Číslo faktúry: <strong>{invoiceNumber ?? "INV-2026-001"}</strong>
              </AlertDescription>
            </Alert>

            <Button onClick={onDownload} variant="outline" className="w-full">
              <Download data-icon="inline-start" />
              Stiahnuť faktúru (PDF)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

