import * as React from "react";

type MobileEntityCardsProps<T> = {
  rows: T[];
  rowKey: (row: T, index: number) => string | number;
  renderCard: (row: T) => React.ReactNode;
  emptyContent?: React.ReactNode;
};

export function MobileEntityCards<T>({
  rows,
  rowKey,
  renderCard,
  emptyContent = "Bez dát",
}: MobileEntityCardsProps<T>) {
  if (rows.length === 0) {
    return <div className="rounded-lg border px-4 py-8 text-sm text-muted-foreground">{emptyContent}</div>;
  }

  return <div className="flex flex-col gap-4">{rows.map((row, index) => <div key={rowKey(row, index)}>{renderCard(row)}</div>)}</div>;
}

