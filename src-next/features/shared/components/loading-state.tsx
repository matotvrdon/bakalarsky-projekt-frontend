import { Loader2 } from "lucide-react";

type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = "Načítavam..." }: LoadingStateProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      <span>{label}</span>
    </div>
  );
}

