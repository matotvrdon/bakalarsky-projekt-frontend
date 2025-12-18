import type { ReactNode } from "react";

type Props = {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  actions?: ReactNode;
};

export default function AdminCard({ title, subtitle, children, actions }: Props) {
  return (
    <div className="admin-card">
      <div>
        {title && <h3>{title}</h3>}
        {subtitle && <p>{subtitle}</p>}
        {children}
      </div>
      {actions && <div className="admin-actions">{actions}</div>}
    </div>
  );
}

