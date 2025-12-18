import type { ReactNode } from "react";

type Props = {
  title: string;
  time?: string;
  children: ReactNode;
};

export default function SubSection({ title, time, children }: Props) {
  return (
    <div className="admin-subsection">
      <div className="admin-subsection-title">
        {title}{" "}
        {time && <span className="admin-subsection-time">({time})</span>}
      </div>
      {children}
    </div>
  );
}
