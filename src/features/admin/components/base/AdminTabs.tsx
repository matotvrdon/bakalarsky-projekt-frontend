import type { ReactNode } from "react";

export type AdminTabItem = {
    value: string;
    label: string;
    shortLabel?: string;
    icon?: ReactNode;
};

type AdminTabsProps = {
    value: string;
    items: AdminTabItem[];
    onChange: (value: string) => void;
};

export function AdminTabs({
                              value,
                              items,
                              onChange,
                          }: AdminTabsProps) {
    return (
        <div
            className="grid w-full rounded-lg bg-gray-100 p-1"
            style={{
                gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`,
            }}
        >
            {items.map((item) => {
                const active = value === item.value;

                return (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() => onChange(item.value)}
                        className={[
                            "flex items-center justify-center gap-2 rounded-md px-3 py-3 text-sm font-medium transition-colors",
                            active
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900",
                        ].join(" ")}
                    >
                        {item.icon}
                        <span className="hidden sm:inline">{item.label}</span>
                        <span className="sm:hidden">{item.shortLabel ?? item.label}</span>
                    </button>
                );
            })}
        </div>
    );
}