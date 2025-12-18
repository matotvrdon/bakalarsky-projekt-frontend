import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function Section({ title, children }: Props) {
  return (
    <section className="admin-section">
      <h3 className="admin-section-title">{title}</h3>
      {children}
    </section>
  );
}
