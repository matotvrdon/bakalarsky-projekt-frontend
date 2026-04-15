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
} from "../../../shared/ui";

export type ConferenceEntryEdit = {
  id: number;
  name: string;
  price: string;
};

export type ConferenceEntryCreate = {
  name: string;
  price: string;
};

type ConferenceEntriesEditorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conferenceName?: string;
  existingEntries: ConferenceEntryEdit[];
  onSave: (payload: { existing: ConferenceEntryEdit[]; additional: ConferenceEntryCreate[] }) => void;
};

export function ConferenceEntriesEditorDialog({
  open,
  onOpenChange,
  conferenceName,
  existingEntries,
  onSave,
}: ConferenceEntriesEditorDialogProps) {
  const [editing, setEditing] = useState<ConferenceEntryEdit[]>([]);
  const [additional, setAdditional] = useState<ConferenceEntryCreate[]>([{ name: "", price: "" }]);

  useEffect(() => {
    if (!open) return;
    setEditing(existingEntries);
    setAdditional([{ name: "", price: "" }]);
  }, [open, existingEntries]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[86vh] w-[88vw] min-w-[600px] max-w-[88vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Správa conference entry</DialogTitle>
          <DialogDescription>
            {conferenceName ? `Typy vstupu pre konferenciu ${conferenceName}` : "Úprava conference entry možností"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-3">
            <Label>Existujúce možnosti</Label>
            {editing.length === 0 ? (
              <p className="text-sm text-muted-foreground">Žiadne existujúce možnosti.</p>
            ) : (
              editing.map((row, index) => (
                <div key={row.id} className="grid grid-cols-[minmax(260px,1fr)_120px_44px] gap-3 rounded-xl border bg-muted/20 p-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`entry-name-${index}`}>Názov</Label>
                    <Input
                      id={`entry-name-${index}`}
                      value={row.name}
                      onChange={(e) => {
                        const value = e.target.value;
                        setEditing((current) => current.map((item, i) => (i === index ? { ...item, name: value } : item)));
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`entry-price-${index}`}>Cena</Label>
                    <Input
                      id={`entry-price-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={row.price}
                      onChange={(e) => {
                        const value = e.target.value;
                        setEditing((current) => current.map((item, i) => (i === index ? { ...item, price: value } : item)));
                      }}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditing((current) => current.filter((item) => item.id !== row.id))}
                    >
                      <Trash2 data-icon="inline-start" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-col gap-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label>Pridať nové možnosti</Label>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAdditional((current) => [...current, { name: "", price: "" }])}
              >
                <Plus data-icon="inline-start" />
                Pridať možnosť
              </Button>
            </div>
            {additional.map((row, index) => (
              <div key={index} className="grid grid-cols-[minmax(260px,1fr)_120px_44px] gap-3 rounded-xl border bg-muted/20 p-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`new-entry-name-${index}`}>Názov</Label>
                  <Input
                    id={`new-entry-name-${index}`}
                    value={row.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAdditional((current) => current.map((item, i) => (i === index ? { ...item, name: value } : item)));
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`new-entry-price-${index}`}>Cena</Label>
                  <Input
                    id={`new-entry-price-${index}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={row.price}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAdditional((current) => current.map((item, i) => (i === index ? { ...item, price: value } : item)));
                    }}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAdditional((current) => current.length === 1 ? [{ name: "", price: "" }] : current.filter((_, i) => i !== index))}
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
                additional: additional.filter((row) => row.name.trim() && row.price.trim()),
              })
            }
          >
            Uložiť conference entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

