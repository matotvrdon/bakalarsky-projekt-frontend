import { Check, X } from "lucide-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../shared/ui";
import { EntityTable } from "./entity-table";
import { FileActions } from "./file-actions";
import { StatusBadge, type StatusTone } from "./status-badge";

export type FileReviewRecord = {
  id: number;
  name: string;
  statusLabel: string;
  statusTone: StatusTone;
  viewUrl: string;
  downloadUrl: string;
  createdAt?: string;
};

type FileReviewDialogProps = {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participantName: string;
  currentStatusLabel: string;
  currentStatusTone: StatusTone;
  latestFile: FileReviewRecord | null;
  history: FileReviewRecord[];
  actionLoading: boolean;
  onApprove: (fileId: number) => void;
  onReject: (fileId: number) => void;
};

export function FileReviewDialog({
  title,
  description,
  open,
  onOpenChange,
  participantName,
  currentStatusLabel,
  currentStatusTone,
  latestFile,
  history,
  actionLoading,
  onApprove,
  onReject,
}: FileReviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div>
            <p className="text-sm text-muted-foreground">Účastník</p>
            <p className="font-medium">{participantName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <StatusBadge label={currentStatusLabel} tone={currentStatusTone} />
          </div>

          {latestFile ? (
            <div className="flex flex-col gap-3 rounded-lg border p-4">
              <p className="font-medium break-all">{latestFile.name}</p>
              <FileActions
                viewUrl={latestFile.viewUrl}
                downloadUrl={latestFile.downloadUrl}
                fileName={latestFile.name}
              />
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => onApprove(latestFile.id)} disabled={actionLoading}>
                  <Check data-icon="inline-start" />
                  Schváliť
                </Button>
                <Button variant="destructive" onClick={() => onReject(latestFile.id)} disabled={actionLoading}>
                  <X data-icon="inline-start" />
                  Zamietnuť
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Bez nahraného súboru.</p>
          )}

          <div className="pt-2">
            <p className="mb-2 text-sm text-muted-foreground">História súborov</p>
            <EntityTable
              rows={history}
              rowKey={(row) => row.id}
              columns={[
                { key: "name", header: "Názov", render: (row) => row.name },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => <StatusBadge label={row.statusLabel} tone={row.statusTone} />,
                },
                {
                  key: "actions",
                  header: "Akcie",
                  className: "text-right",
                  render: (row) => (
                    <div className="flex justify-end">
                      <FileActions viewUrl={row.viewUrl} downloadUrl={row.downloadUrl} fileName={row.name} />
                    </div>
                  ),
                },
              ]}
              emptyContent="Bez starších záznamov."
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
