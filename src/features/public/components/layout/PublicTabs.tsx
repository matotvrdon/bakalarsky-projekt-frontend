import { FileText, Hotel, Receipt, User } from "lucide-react";

import type { PublicTabItem, PublicTabValue } from "../../types/publicTypes.ts";

const tabs: PublicTabItem[] = [
    {
        value: "participation",
        label: "Účasť",
        shortLabel: "Účasť",
        icon: <User className="h-4 w-4" />,
    },
    {
        value: "submission",
        label: "Príspevok",
        shortLabel: "Príspev.",
        icon: <FileText className="h-4 w-4" />,
    },
    {
        value: "services",
        label: "Služby",
        shortLabel: "Služby",
        icon: <Hotel className="h-4 w-4" />,
    },
    {
        value: "invoice",
        label: "Faktúra",
        shortLabel: "Faktúra",
        icon: <Receipt className="h-4 w-4" />,
    },
];

type PublicTabsProps = {
    value: PublicTabValue;
    onChange: (value: PublicTabValue) => void;
};

export function PublicTabs({ value, onChange }: PublicTabsProps) {
    return (
        <div className="grid w-full grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1 sm:grid-cols-4">
            {tabs.map((tab) => {
                const isActive = tab.value === value;

                return (
                    <button
                        key={tab.value}
                        type="button"
                        onClick={() => onChange(tab.value)}
                        className={[
                            "flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-xs font-semibold transition sm:text-sm",
                            isActive
                                ? "bg-white text-blue-700 shadow-sm"
                                : "text-gray-600 hover:bg-white/70",
                        ].join(" ")}
                    >
                        {tab.icon}

                        <span className="hidden sm:inline">
                            {tab.label}
                        </span>

                        <span className="sm:hidden">
                            {tab.shortLabel}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}