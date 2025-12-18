import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AdminList({ children }: Props) {
  return <div className="admin-list">{children}</div>;
}

