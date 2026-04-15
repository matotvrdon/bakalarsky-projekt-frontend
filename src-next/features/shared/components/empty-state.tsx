import { Inbox } from "lucide-react";

import { cn } from "../../../shared/ui";

type EmptyStateProps = {
  title: string;
  description?: string;
  className?: string;
};

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center",
        className,
      )}
    >
      <Inbox className="mx-auto size-6 text-muted-foreground" />
      <p className="mt-3 font-medium">{title}</p>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}

