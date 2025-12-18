import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger";

type Props = {
  children: ReactNode;
  variant?: Variant;
  onClick?: () => void;
};

export default function AdminButton({ children, variant = "primary", onClick }: Props) {
  const className = variant === "primary"
    ? "admin-btn"
    : `admin-btn ${variant}`;

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}

