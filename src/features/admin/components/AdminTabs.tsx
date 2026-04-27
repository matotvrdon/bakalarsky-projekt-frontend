import { Building2, Receipt, Users } from "lucide-react";

import {
    AdminTabs as AdminBaseTabs,
    type AdminTabItem,
} from "./base/index.ts";

type AdminTabsProps = {
    value: string;
    onChange: (value: string) => void;
};

const adminTabs: AdminTabItem[] = [
    {
        value: "conferences",
        label: "Konferencie",
        shortLabel: "Konf.",
        icon: <Building2 className="h-4 w-4" />,
    },
    {
        value: "participants",
        label: "Účastníci",
        shortLabel: "Účast.",
        icon: <Users className="h-4 w-4" />,
    },
    {
        value: "invoices",
        label: "Faktúry",
        shortLabel: "Fakt.",
        icon: <Receipt className="h-4 w-4" />,
    },
];

export function AdminTabs({ value, onChange }: AdminTabsProps) {
    return (
        <AdminBaseTabs
            value={value}
            items={adminTabs}
            onChange={onChange}
        />
    );
}