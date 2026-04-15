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

export type BookingOptionForm = {
  id?: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  price: string;
};

type BookingOptionsEditorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conferenceName?: string;
  existingOptions: BookingOptionForm[];
  onSave: (payload: { existing: BookingOptionForm[]; additional: BookingOptionForm[] }) => void;
};

const emptyBookingOption = (): BookingOptionForm => ({
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  price: "",
});

export function BookingOptionsEditorDialog({
  open,
  onOpenChange,
  conferenceName,
  existingOptions,
  onSave,
}: BookingOptionsEditorDialogProps) {
  const [editing, setEditing] = useState<BookingOptionForm[]>([]);
  const [additional, setAdditional] = useState<BookingOptionForm[]>([emptyBookingOption()]);

  useEffect(() => {
    if (!open) return;
    setEditing(existingOptions);
    setAdditional([emptyBookingOption()]);
  }, [open, existingOptions]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[86vh] w-[88vw] min-w-[1000px] max-w-[88vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Správa ubytovacích možností</DialogTitle>
          <DialogDescription>
            {conferenceName ? `Ubytovanie pre konferenciu ${conferenceName}` : "Úprava ubytovania konferencie"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-3">
            <Label>Existujúce možnosti</Label>
            {editing.map((row, index) => (
              <BookingOptionRow
                key={row.id ?? index}
                row={row}
                onChange={(next) => setEditing((current) => current.map((item, i) => (i === index ? next : item)))}
                onDelete={() => setEditing((current) => current.filter((_, i) => i !== index))}
              />
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label>Pridať nové možnosti</Label>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAdditional((current) => [...current, emptyBookingOption()])}
              >
                <Plus data-icon="inline-start" />
                Pridať možnosť
              </Button>
            </div>
            {additional.map((row, index) => (
              <BookingOptionRow
                key={index}
                row={row}
                onChange={(next) => setAdditional((current) => current.map((item, i) => (i === index ? next : item)))}
                onDelete={() => setAdditional((current) => current.length === 1 ? [emptyBookingOption()] : current.filter((_, i) => i !== index))}
              />
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Zrušiť</Button>
          <Button
            onClick={() =>
              onSave({
                existing: editing,
                additional: additional.filter(
                  (row) =>
                    row.name.trim() &&
                    row.description.trim() &&
                    row.startDate.trim() &&
                    row.endDate.trim() &&
                    row.price.trim(),
                ),
              })
            }
          >
            Uložiť ubytovanie
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type BookingOptionRowProps = {
  row: BookingOptionForm;
  onChange: (next: BookingOptionForm) => void;
  onDelete: () => void;
};

function BookingOptionRow({ row, onChange, onDelete }: BookingOptionRowProps) {
  return (
    <div className="grid grid-cols-[minmax(140px,1.05fr)_minmax(180px,1.35fr)_84px_110px_110px_44px] gap-3 rounded-xl border bg-muted/20 p-4">
      <div className="flex flex-col gap-2">
        <Label>Názov</Label>
        <Input value={row.name} onChange={(e) => onChange({ ...row, name: e.target.value })} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Popis</Label>
        <Textarea rows={3} value={row.description} onChange={(e) => onChange({ ...row, description: e.target.value })} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Cena</Label>
        <Input type="number" min="0" step="0.01" value={row.price} onChange={(e) => onChange({ ...row, price: e.target.value })} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Od</Label>
        <Input type="date" value={row.startDate} onChange={(e) => onChange({ ...row, startDate: e.target.value })} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Do</Label>
        <Input type="date" value={row.endDate} onChange={(e) => onChange({ ...row, endDate: e.target.value })} />
      </div>
      <div className="flex items-end">
        <Button type="button" variant="outline" onClick={onDelete}>
          <Trash2 data-icon="inline-start" />
        </Button>
      </div>
    </div>
  );
}

