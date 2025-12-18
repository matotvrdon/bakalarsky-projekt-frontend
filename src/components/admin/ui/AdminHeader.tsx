import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: ReactNode;
};

export default function AdminHeader({ title, subtitle }: Props) {
  return (
    <div className="admin-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="admin-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

