import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Textarea,
} from "../../../shared/ui";

export type ImportantDateEdit = {
  id: number;
  label: string;
  normalDate: string;
  updatedDate: string;
};

export type ImportantDateCreate = {
  label: string;
  normalDate: string;
};

type ImportantDatesEditorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conferenceName?: string;
  existingDates: ImportantDateEdit[];
  onSave: (payload: { existing: ImportantDateEdit[]; additional: ImportantDateCreate[] }) => void;
};

export function ImportantDatesEditorDialog({
  open,
  onOpenChange,
  conferenceName,
  existingDates,
  onSave,
}: ImportantDatesEditorDialogProps) {
  const [editing, setEditing] = useState<ImportantDateEdit[]>([]);
  const [additional, setAdditional] = useState<ImportantDateCreate[]>([{ label: "", normalDate: "" }]);

  useEffect(() => {
    if (!open) return;
    setEditing(existingDates.length > 0 ? existingDates : [{ id: 0, label: "", normalDate: "", updatedDate: "" }]);
    setAdditional([{ label: "", normalDate: "" }]);
  }, [open, existingDates]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[86vh] w-[88vw] min-w-[600px] max-w-[88vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Správa dôležitých termínov</DialogTitle>
          <DialogDescription>
            {conferenceName ? `Termíny pre konferenciu ${conferenceName}` : "Úprava termínov konferencie"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-3">
            <Label>Existujúce termíny</Label>
            {editing.map((row, index) => (
              <div key={`${row.id}-${index}`} className="grid grid-cols-[minmax(320px,2.8fr)_120px_120px] gap-4 rounded-xl border bg-muted/20 p-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`date-label-${index}`}>Popis</Label>
                  <Textarea
                    id={`date-label-${index}`}
                    rows={3}
                    value={row.label}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEditing((current) => current.map((item, i) => (i === index ? { ...item, label: value } : item)));
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Pôvodný dátum</Label>
                  <Input value={row.normalDate} readOnly />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Zmenený dátum</Label>
                  <Input
                    type="date"
                    value={row.updatedDate}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEditing((current) => current.map((item, i) => (i === index ? { ...item, updatedDate: value } : item)));
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label>Pridať nové termíny</Label>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAdditional((current) => [...current, { label: "", normalDate: "" }])}
              >
                <Plus data-icon="inline-start" />
                Pridať dátum
              </Button>
            </div>
            {additional.map((row, index) => (
              <div key={index} className="grid grid-cols-[minmax(320px,2.8fr)_120px_auto] gap-4 rounded-xl border bg-muted/20 p-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`new-date-label-${index}`}>Popis</Label>
                  <Textarea
                    id={`new-date-label-${index}`}
                    rows={3}
                    value={row.label}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAdditional((current) => current.map((item, i) => (i === index ? { ...item, label: value } : item)));
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Dátum</Label>
                  <Input
                    type="date"
                    value={row.normalDate}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAdditional((current) => current.map((item, i) => (i === index ? { ...item, normalDate: value } : item)));
                    }}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setAdditional((current) =>
                        current.length === 1 ? [{ label: "", normalDate: "" }] : current.filter((_, i) => i !== index),
                      );
                    }}
                  >
                    <Trash2 data-icon="inline-start" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Zrušiť</Button>
          <Button
            onClick={() =>
              onSave({
                existing: editing,
                additional: additional.filter((row) => row.label.trim() && row.normalDate.trim()),
              })
            }
          >
            Uložiť termíny
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

