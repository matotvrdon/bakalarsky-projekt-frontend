import { Badge, Card, CardContent, CardHeader, CardTitle } from "../../../shared/ui";
import { ConferenceActions } from "./conference-actions";

export type ConferenceCardData = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  isActive: boolean;
  participantsCount: number;
};

type ConferenceCardProps = {
  conference: ConferenceCardData;
  onEntries: () => void;
  onDates: () => void;
  onFood: () => void;
  onBooking: () => void;
  onProgram: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSetActive?: () => void;
};

export function ConferenceCard({
  conference,
  onEntries,
  onDates,
  onFood,
  onBooking,
  onProgram,
  onEdit,
  onDelete,
  onSetActive,
}: ConferenceCardProps) {
  return (
    <Card className={conference.isActive ? "border-blue-500 bg-blue-50" : undefined}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{conference.name}</span>
          {conference.isActive ? <Badge>Aktívna</Badge> : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">{conference.description}</p>
        <p className="text-sm text-muted-foreground">
          {conference.startDate} - {conference.endDate} • {conference.location}
        </p>
        <p className="text-sm text-muted-foreground">{conference.participantsCount} účastníkov</p>
        <ConferenceActions
          onEntries={onEntries}
          onDates={onDates}
          onFood={onFood}
          onBooking={onBooking}
          onProgram={onProgram}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetActive={onSetActive}
        />
      </CardContent>
    </Card>
  );
}

