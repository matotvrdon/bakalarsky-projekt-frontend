import { Building2, Clock3, FolderTree, Hotel, Pencil, Trash2, UtensilsCrossed, Users } from "lucide-react";

import { Button } from "../../../shared/ui";

type ConferenceActionsProps = {
  onEntries: () => void;
  onDates: () => void;
  onFood: () => void;
  onBooking: () => void;
  onProgram: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSetActive?: () => void;
};

export function ConferenceActions({
  onEntries,
  onDates,
  onFood,
  onBooking,
  onProgram,
  onEdit,
  onDelete,
  onSetActive,
}: ConferenceActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={onEntries}>
        <Users data-icon="inline-start" />
        Entry
      </Button>
      <Button variant="outline" size="sm" onClick={onDates}>
        <Clock3 data-icon="inline-start" />
        Termíny
      </Button>
      <Button variant="outline" size="sm" onClick={onFood}>
        <UtensilsCrossed data-icon="inline-start" />
        Strava
      </Button>
      <Button variant="outline" size="sm" onClick={onBooking}>
        <Hotel data-icon="inline-start" />
        Ubytovanie
      </Button>
      <Button variant="outline" size="sm" onClick={onProgram}>
        <FolderTree data-icon="inline-start" />
        Program
      </Button>
      <Button variant="outline" size="sm" onClick={onEdit}>
        <Pencil data-icon="inline-start" />
        Upraviť
      </Button>
      {onSetActive ? (
        <Button variant="outline" size="sm" onClick={onSetActive}>
          <Building2 data-icon="inline-start" />
          Aktivovať
        </Button>
      ) : null}
      <Button variant="destructive" size="sm" onClick={onDelete}>
        <Trash2 data-icon="inline-start" />
        Vymazať
      </Button>
    </div>
  );
}

