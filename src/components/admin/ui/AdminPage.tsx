import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AdminPage({ children }: Props) {
  return <div className="admin-page">{children}</div>;
}

