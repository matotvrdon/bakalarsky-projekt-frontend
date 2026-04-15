import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";

import {
  Badge,
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
} from "../../../shared/ui";

export type ProgramPresentationForm = {
  clientId: string;
  startTime: string;
  endTime: string;
  authors: string;
  title: string;
};

export type ProgramSessionForm = {
  clientId: string;
  sessionName: string;
  startTime: string;
  endTime: string;
  chair: string;
  presentations: ProgramPresentationForm[];
};

export type ProgramItemForm = {
  clientId: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  speaker: string;
  chair: string;
  type: number;
  sessions: ProgramSessionForm[];
};

export type ProgramDayForm = {
  clientId: string;
  label: string;
  date: string;
  items: ProgramItemForm[];
};

type ProgramBuilderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conferenceName?: string;
  initialDays: ProgramDayForm[];
  onSave: (days: ProgramDayForm[]) => void;
};

const createClientId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const emptyPresentation = (): ProgramPresentationForm => ({ clientId: createClientId(), startTime: "", endTime: "", authors: "", title: "" });
const emptySession = (): ProgramSessionForm => ({ clientId: createClientId(), sessionName: "", startTime: "", endTime: "", chair: "", presentations: [emptyPresentation()] });
const emptyItem = (): ProgramItemForm => ({ clientId: createClientId(), title: "", startTime: "", endTime: "", location: "", speaker: "", chair: "", type: 0, sessions: [] });
const emptyDay = (): ProgramDayForm => ({ clientId: createClientId(), label: "", date: "", items: [emptyItem()] });

export function ProgramBuilderDialog({
  open,
  onOpenChange,
  conferenceName,
  initialDays,
  onSave,
}: ProgramBuilderDialogProps) {
  const [days, setDays] = useState<ProgramDayForm[]>([emptyDay()]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!open) return;
    const nextDays = initialDays.length > 0 ? initialDays : [emptyDay()];
    setDays(nextDays);
    const nextExpanded: Record<string, boolean> = {};
    nextDays.forEach((day) => {
      nextExpanded[`day-${day.clientId}`] = true;
      day.items.forEach((item) => {
        nextExpanded[`item-${item.clientId}`] = true;
        item.sessions.forEach((session) => {
          nextExpanded[`session-${session.clientId}`] = true;
        });
      });
    });
    setExpanded(nextExpanded);
  }, [open, initialDays]);

  const toggle = (key: string) => setExpanded((current) => ({ ...current, [key]: !current[key] }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[88vh] w-[88vw] min-w-[900px] max-w-[88vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Program konferencie</DialogTitle>
          <DialogDescription>
            {conferenceName ? `Program pre konferenciu ${conferenceName}` : "Editor programu po dňoch"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <div className="flex flex-wrap justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => {
                setDays([]);
                setExpanded({});
              }}
            >
              <Trash2 data-icon="inline-start" />
              Vymazať všetko
            </Button>
            <Button
              type="button"
              onClick={() => {
                const next = emptyDay();
                setDays((current) => [...current, next]);
                setExpanded((current) => ({ ...current, [`day-${next.clientId}`]: true }));
              }}
            >
              <Plus data-icon="inline-start" />
              Pridať deň
            </Button>
          </div>

          {days.length === 0 ? (
            <div className="rounded-xl border border-dashed px-6 py-10 text-center text-muted-foreground">
              Program je prázdny. Pridaj prvý deň.
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {days.map((day, dayIndex) => {
                const dayKey = `day-${day.clientId}`;
                const dayOpen = expanded[dayKey] ?? true;
                return (
                  <div key={day.clientId} className="rounded-2xl border bg-card">
                    <div className="flex items-start justify-between gap-4 bg-muted/20 px-6 py-5">
                      <div className="flex min-w-0 items-start gap-4">
                        <button type="button" onClick={() => toggle(dayKey)} className="mt-1 rounded-md p-1 hover:bg-background">
                          {dayOpen ? <ChevronDown className="size-5" /> : <ChevronRight className="size-5" />}
                        </button>
                        <div className="grid gap-3 md:grid-cols-[minmax(260px,1fr)_180px]">
                          <div className="flex flex-col gap-2">
                            <Label>Názov dňa</Label>
                            <Input
                              value={day.label}
                              onChange={(e) => {
                                const value = e.target.value;
                                setDays((current) => current.map((item, i) => (i === dayIndex ? { ...item, label: value } : item)));
                              }}
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label>Dátum</Label>
                            <Input
                              type="date"
                              value={day.date}
                              onChange={(e) => {
                                const value = e.target.value;
                                setDays((current) => current.map((item, i) => (i === dayIndex ? { ...item, date: value } : item)));
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const next = emptyItem();
                            setDays((current) =>
                              current.map((item, i) => (i === dayIndex ? { ...item, items: [...item.items, next] } : item)),
                            );
                            setExpanded((current) => ({ ...current, [`item-${next.clientId}`]: true }));
                          }}
                        >
                          <Plus data-icon="inline-start" />
                          Položka
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => setDays((current) => current.filter((_, i) => i !== dayIndex))}
                        >
                          <Trash2 data-icon="inline-start" />
                        </Button>
                      </div>
                    </div>

                    {dayOpen ? (
                      <div className="flex flex-col gap-4 px-6 py-5">
                        {day.items.map((item, itemIndex) => {
                          const itemKey = `item-${item.clientId}`;
                          const itemOpen = expanded[itemKey] ?? true;
                          return (
                            <div key={item.clientId} className="rounded-xl border bg-muted/20 p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 items-start gap-3">
                                  <button type="button" onClick={() => toggle(itemKey)} className="mt-1 rounded-md p-1 hover:bg-background">
                                    {itemOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                                  </button>
                                  <div>
                                    <p className="font-semibold">{item.title || `Položka ${itemIndex + 1}`}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {item.startTime || "--:--"} - {item.endTime || "--:--"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{getProgramTypeLabel(item.type)}</Badge>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const next = emptySession();
                                      setDays((current) =>
                                        current.map((dayRow, dIndex) =>
                                          dIndex !== dayIndex
                                            ? dayRow
                                            : {
                                                ...dayRow,
                                                items: dayRow.items.map((itemRow, iIndex) =>
                                                  iIndex === itemIndex ? { ...itemRow, sessions: [...itemRow.sessions, next] } : itemRow,
                                                ),
                                              },
                                        ),
                                      );
                                      setExpanded((current) => ({ ...current, [`session-${next.clientId}`]: true }));
                                    }}
                                  >
                                    <Plus data-icon="inline-start" />
                                    Session
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                    onClick={() =>
                                      setDays((current) =>
                                        current.map((dayRow, dIndex) =>
                                          dIndex !== dayIndex
                                            ? dayRow
                                            : { ...dayRow, items: dayRow.items.filter((_, iIndex) => iIndex !== itemIndex) },
                                        ),
                                      )
                                    }
                                  >
                                    <Trash2 data-icon="inline-start" />
                                  </Button>
                                </div>
                              </div>

                              {itemOpen ? (
                                <div className="mt-4 flex flex-col gap-4">
                                  <div className="grid gap-4 md:grid-cols-[minmax(260px,1.5fr)_120px_120px_180px]">
                                    <div className="flex flex-col gap-2">
                                      <Label>Názov položky</Label>
                                      <Input
                                        value={item.title}
                                        onChange={(e) => updateProgramItem(setDays, dayIndex, itemIndex, "title", e.target.value)}
                                      />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      <Label>Začiatok</Label>
                                      <Input
                                        type="time"
                                        value={item.startTime}
                                        onChange={(e) => updateProgramItem(setDays, dayIndex, itemIndex, "startTime", e.target.value)}
                                      />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      <Label>Koniec</Label>
                                      <Input
                                        type="time"
                                        value={item.endTime}
                                        onChange={(e) => updateProgramItem(setDays, dayIndex, itemIndex, "endTime", e.target.value)}
                                      />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      <Label>Typ</Label>
                                      <Select
                                        value={String(item.type)}
                                        onValueChange={(value) =>
                                          updateProgramItem(setDays, dayIndex, itemIndex, "type", Number(value))
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                                            <SelectItem key={value} value={String(value)}>
                                              {getProgramTypeLabel(value)}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>

                                  <div className="grid gap-4 md:grid-cols-3">
                                    <div className="flex flex-col gap-2">
                                      <Label>Miesto</Label>
                                      <Input
                                        value={item.location}
                                        onChange={(e) => updateProgramItem(setDays, dayIndex, itemIndex, "location", e.target.value)}
                                      />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      <Label>Speaker</Label>
                                      <Input
                                        value={item.speaker}
                                        onChange={(e) => updateProgramItem(setDays, dayIndex, itemIndex, "speaker", e.target.value)}
                                      />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      <Label>Chair</Label>
                                      <Input
                                        value={item.chair}
                                        onChange={(e) => updateProgramItem(setDays, dayIndex, itemIndex, "chair", e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Zrušiť</Button>
          <Button onClick={() => onSave(days)}>Uložiť program</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function updateProgramItem(
  setDays: Dispatch<SetStateAction<ProgramDayForm[]>>,
  dayIndex: number,
  itemIndex: number,
  field: keyof Omit<ProgramItemForm, "clientId" | "sessions">,
  value: string | number,
) {
  setDays((current) =>
    current.map((dayRow, dIndex) =>
      dIndex !== dayIndex
        ? dayRow
        : {
            ...dayRow,
            items: dayRow.items.map((itemRow, iIndex) =>
              iIndex === itemIndex ? { ...itemRow, [field]: value } : itemRow,
            ),
          },
    ),
  );
}

function getProgramTypeLabel(type: number) {
  if (type === 0) return "registration";
  if (type === 1) return "opening";
  if (type === 2) return "keynote";
  if (type === 3) return "parallel";
  if (type === 4) return "session";
  if (type === 5) return "workshop";
  if (type === 6) return "panel";
  if (type === 7) return "break";
  if (type === 8) return "social";
  if (type === 9) return "poster";
  return "closing";
}
