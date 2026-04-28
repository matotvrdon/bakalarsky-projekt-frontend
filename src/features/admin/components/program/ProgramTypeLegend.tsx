import { programLegendItems } from "../../utils/adminUtils.ts";

export function ProgramTypeLegend() {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-4">
                <h3 className="text-base font-bold text-gray-900">
                    Legenda typov programu
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                    Farby zodpovedajú typom položiek programu.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
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

                        <span className="ml-auto rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-gray-500">
                            {item.valueLabel}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}