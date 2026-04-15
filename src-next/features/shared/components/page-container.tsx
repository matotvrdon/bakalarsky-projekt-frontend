import * as React from "react";

import { cn } from "../../../shared/ui";

type PageContainerProps = React.ComponentProps<"div"> & {
  size?: "md" | "lg" | "xl";
};

const sizeClassName: Record<NonNullable<PageContainerProps["size"]>, string> = {
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
};

export function PageContainer({
  className,
  size = "xl",
  ...props
}: PageContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizeClassName[size], className)}
      {...props}
    />
  );
}

