import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from "../../../shared/ui";

export type EntityColumn<T> = {
  key: string;
  header: React.ReactNode;
  className?: string;
  render: (row: T) => React.ReactNode;
};

type EntityTableProps<T> = {
  rows: T[];
  columns: EntityColumn<T>[];
  rowKey: (row: T, index: number) => string | number;
  emptyContent?: React.ReactNode;
};

export function EntityTable<T>({
  rows,
  columns,
  rowKey,
  emptyContent = "Bez dát",
}: EntityTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key} className={column.className}>
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-sm text-muted-foreground">
              {emptyContent}
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row, index) => (
            <TableRow key={rowKey(row, index)}>
              {columns.map((column) => (
                <TableCell key={column.key} className={cn(column.className)}>
                  {column.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

