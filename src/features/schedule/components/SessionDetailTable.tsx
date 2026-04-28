import { Users } from "lucide-react";

import type { ProgramSession } from "../../../api/conferenceApi.ts";

import {
    formatTimeRange,
    sortPresentations,
} from "../utils/scheduleUtils.ts";

type SessionDetailTableProps = {
    session: ProgramSession;
};

export function SessionDetailTable({
                                       session,
                                   }: SessionDetailTableProps) {
    const presentations = sortPresentations(session.presentations);

    return (
        <div className="mt-4">
            {session.chair ? (
                <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>
                        <strong>Chair:</strong> {session.chair}
                    </span>
                </div>
            ) : null}

            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                <table className="w-full min-w-[720px] border-collapse text-left">
                    <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                        <th className="w-[120px] px-4 py-3 text-sm font-semibold text-gray-700">
                            Čas
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                            Autori
                        </th>
                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                            Názov príspevku
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {presentations.map((presentation) => (
                        <tr
                            key={presentation.id}
                            className="border-b border-gray-100 last:border-b-0"
                        >
                            <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-800">
                                {formatTimeRange(
                                    presentation.startTime,
                                    presentation.endTime
                                )}
                            </td>

                            <td className="px-4 py-3 text-sm text-gray-700">
                                {presentation.authors}
                            </td>

                            <td className="px-4 py-3 text-sm italic text-gray-700">
                                {presentation.title}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}