import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export default function AdminEmpty({ children }: Props) {
  return <div className="admin-empty">{children ?? "No items"}</div>;
}

