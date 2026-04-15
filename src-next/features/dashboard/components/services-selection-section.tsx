import {
  Alert,
  AlertDescription,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Label,
  RadioGroup,
  RadioGroupItem,
} from "../../../shared/ui";

type BookingOption = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
};

type FoodOption = {
  id: number;
  name: string;
  description: string;
  date: string;
  foodOptionsType: number;
  price: number;
};

type ServicesSelectionSectionProps = {
  bookingOptions: BookingOption[];
  selectedBookingId: number | null;
  onSelectBookingId: (id: number | null) => void;
  foodOptions: FoodOption[];
  selectedFoodIds: number[];
  onSelectFoodIds: (ids: number[]) => void;
  getFoodTypeLabel: (value: number) => string;
};

export function ServicesSelectionSection({
  bookingOptions,
  selectedBookingId,
  onSelectBookingId,
  foodOptions,
  selectedFoodIds,
  onSelectFoodIds,
  getFoodTypeLabel,
}: ServicesSelectionSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Ubytovanie</CardTitle>
          <CardDescription>Vyberte si ubytovanie dostupné pre aktívnu konferenciu.</CardDescription>
        </CardHeader>
        <CardContent>
          {bookingOptions.length === 0 ? (
            <Alert>
              <AlertDescription>Pre túto konferenciu zatiaľ nie sú dostupné žiadne možnosti ubytovania.</AlertDescription>
            </Alert>
          ) : (
            <RadioGroup value={selectedBookingId ? String(selectedBookingId) : ""} onValueChange={(value) => onSelectBookingId(value ? Number(value) : null)}>
              {bookingOptions.map((option) => (
                <Label key={option.id} htmlFor={`booking-${option.id}`} className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 hover:bg-muted/20">
                  <RadioGroupItem value={String(option.id)} id={`booking-${option.id}`} className="mt-1" />
                  <div className="flex-1">
                    <div className="font-semibold">{option.name}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{option.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{option.startDate} - {option.endDate}</p>
                  </div>
                  <Badge variant="secondary">{option.price} €</Badge>
                </Label>
              ))}
            </RadioGroup>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stravovanie</CardTitle>
          <CardDescription>Vyberte si stravovanie počas konferencie.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {foodOptions.length === 0 ? (
            <Alert>
              <AlertDescription>Pre túto konferenciu zatiaľ nie sú dostupné žiadne možnosti stravovania.</AlertDescription>
            </Alert>
          ) : (
            foodOptions.map((option) => (
              <Label key={option.id} htmlFor={`food-${option.id}`} className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 hover:bg-muted/20">
                <Checkbox
                  id={`food-${option.id}`}
                  checked={selectedFoodIds.includes(option.id)}
                  onCheckedChange={(checked) =>
                    onSelectFoodIds(
                      checked === true
                        ? [...selectedFoodIds, option.id]
                        : selectedFoodIds.filter((id) => id !== option.id),
                    )
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-semibold">{option.name}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{option.description}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{getFoodTypeLabel(option.foodOptionsType)}</span>
                    <span>•</span>
                    <span>{option.date}</span>
                  </div>
                </div>
                <Badge variant="secondary">{option.price} €</Badge>
              </Label>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

