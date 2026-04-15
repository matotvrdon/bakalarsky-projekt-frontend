import { Badge, cn } from "../../../shared/ui";

export type StatusTone = "approved" | "rejected" | "pending" | "draft" | "none";

const toneClassName: Record<StatusTone, string> = {
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  draft: "bg-orange-100 text-orange-800 border-orange-200",
  none: "bg-gray-100 text-gray-700 border-gray-200",
};

type StatusBadgeProps = {
  label: string;
  tone: StatusTone;
  className?: string;
};

export function StatusBadge({ label, tone, className }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(toneClassName[tone], className)}>
      {label}
    </Badge>
  );
}

