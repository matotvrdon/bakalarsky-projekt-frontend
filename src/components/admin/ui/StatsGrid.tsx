import type { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

export default function StatsGrid({ children }: Props) {
    return <div className="admin-stats">{children}</div>;
}

