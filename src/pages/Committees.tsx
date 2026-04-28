import {
    CommitteePageHeader,
    CommitteePageShell,
    CommitteeSection,
    CommitteesEmptyState,
    CommitteesErrorState,
    CommitteesLoadingState,
} from "../features/committees/components/index.ts";

import { useCommittees } from "../features/committees/hooks/useCommittees.ts";
import { sortCommittees } from "../features/committees/utils/committeeUtils.ts";

export function Committees() {
    const {
        data,
        loading,
        error,
    } = useCommittees();

    const committees = sortCommittees(data?.committees ?? []);

    return (
        <CommitteePageShell>
            <CommitteePageHeader conferenceName={data?.conferenceName} />

            {loading && (
                <CommitteesLoadingState />
            )}

            {!loading && error && (
                <CommitteesErrorState message={error} />
            )}

            {!loading && !error && committees.length === 0 && (
                <CommitteesEmptyState />
            )}

            {!loading && !error && committees.length > 0 && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {committees.map((committee) => (
                        <CommitteeSection
                            key={committee.id}
                            committee={committee}
                        />
                    ))}
                </div>
            )}
        </CommitteePageShell>
    );
}