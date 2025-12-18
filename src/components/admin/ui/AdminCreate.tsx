import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function AdminCreate({ title, children }: Props) {
  return (
    <div className="admin-create">
      <h2>{title}</h2>
      <div className="admin-form">{children}</div>
    </div>
  );
}

