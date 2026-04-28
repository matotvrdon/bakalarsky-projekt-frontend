import { programLegendItems } from "../utils/scheduleUtils.ts";

export function ProgramLegend() {
    return (
        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 text-center">
                <h2 className="text-lg font-bold text-gray-900">
                    Legenda programu
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Farebné označenie typov položiek programu.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {programLegendItems.map((item) => (
                    <div
                        key={item.type}
                        className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                    >
                        <span
                            className={[
                                "h-4 w-4 shrink-0 rounded",
                                item.dotClassName,
                            ].join(" ")}
                        />

                        <span className="text-sm font-medium text-gray-700">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}