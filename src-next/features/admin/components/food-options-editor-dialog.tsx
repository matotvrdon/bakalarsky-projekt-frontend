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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "../../../shared/ui";

export type FoodOptionForm = {
  id?: number;
  name: string;
  description: string;
  date: string;
  price: string;
  foodOptionsType: 0 | 1 | 2;
};

type FoodOptionsEditorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conferenceName?: string;
  existingOptions: FoodOptionForm[];
  onSave: (payload: { existing: FoodOptionForm[]; additional: FoodOptionForm[] }) => void;
};

const emptyFoodOption = (): FoodOptionForm => ({
  name: "",
  description: "",
  date: "",
  price: "",
  foodOptionsType: 0,
});

export function FoodOptionsEditorDialog({
  open,
  onOpenChange,
  conferenceName,
  existingOptions,
  onSave,
}: FoodOptionsEditorDialogProps) {
  const [editing, setEditing] = useState<FoodOptionForm[]>([]);
  const [additional, setAdditional] = useState<FoodOptionForm[]>([emptyFoodOption()]);

  useEffect(() => {
    if (!open) return;
    setEditing(existingOptions);
    setAdditional([emptyFoodOption()]);
  }, [open, existingOptions]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[86vh] w-[88vw] min-w-[1000px] max-w-[88vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Správa stravovacích možností</DialogTitle>
          <DialogDescription>
            {conferenceName ? `Stravovanie pre konferenciu ${conferenceName}` : "Úprava stravovania konferencie"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-3">
            <Label>Existujúce možnosti</Label>
            {editing.map((row, index) => (
              <FoodOptionRow
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
                onClick={() => setAdditional((current) => [...current, emptyFoodOption()])}
              >
                <Plus data-icon="inline-start" />
                Pridať možnosť
              </Button>
            </div>
            {additional.map((row, index) => (
              <FoodOptionRow
                key={index}
                row={row}
                onChange={(next) => setAdditional((current) => current.map((item, i) => (i === index ? next : item)))}
                onDelete={() => setAdditional((current) => current.length === 1 ? [emptyFoodOption()] : current.filter((_, i) => i !== index))}
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
                additional: additional.filter((row) => row.name.trim() && row.description.trim() && row.price.trim() && row.date.trim()),
              })
            }
          >
            Uložiť stravu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type FoodOptionRowProps = {
  row: FoodOptionForm;
  onChange: (next: FoodOptionForm) => void;
  onDelete: () => void;
};

function FoodOptionRow({ row, onChange, onDelete }: FoodOptionRowProps) {
  return (
    <div className="grid grid-cols-[minmax(140px,1.05fr)_minmax(180px,1.35fr)_88px_84px_110px_44px] gap-3 rounded-xl border bg-muted/20 p-4">
      <div className="flex flex-col gap-2">
        <Label>Názov</Label>
        <Input value={row.name} onChange={(e) => onChange({ ...row, name: e.target.value })} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Popis</Label>
        <Textarea rows={3} value={row.description} onChange={(e) => onChange({ ...row, description: e.target.value })} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Typ</Label>
        <Select value={String(row.foodOptionsType)} onValueChange={(value) => onChange({ ...row, foodOptionsType: Number(value) as 0 | 1 | 2 })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Raňajky</SelectItem>
            <SelectItem value="1">Obed</SelectItem>
            <SelectItem value="2">Večera</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Cena</Label>
        <Input type="number" min="0" step="0.01" value={row.price} onChange={(e) => onChange({ ...row, price: e.target.value })} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Dátum</Label>
        <Input type="date" value={row.date} onChange={(e) => onChange({ ...row, date: e.target.value })} />
      </div>
      <div className="flex items-end">
        <Button type="button" variant="outline" onClick={onDelete}>
          <Trash2 data-icon="inline-start" />
        </Button>
      </div>
    </div>
  );
}

