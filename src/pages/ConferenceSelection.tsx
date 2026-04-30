import {
    ConferenceSelectionEmptyState,
    ConferenceSelectionErrorState,
    ConferenceSelectionHeader,
    ConferenceSelectionList,
    ConferenceSelectionLoadingState,
    ConferenceSelectionTopBar,
} from "../features/conferenceSelection/components/index.ts";

import { useConferenceSelection } from "../features/conferenceSelection/hooks/useConferenceSelection.ts";

export function ConferenceSelection() {
    const {
        conferences,
        loading,
        error,
    } = useConferenceSelection();

    return (
        <>
            <ConferenceSelectionTopBar
                currentUser={null}
                onLogout={() => undefined}
            />

            {loading && <ConferenceSelectionLoadingState />}

            {!loading && error && (
                <ConferenceSelectionErrorState message={error} />
            )}

            {!loading && !error && conferences.length === 0 && (
                <ConferenceSelectionEmptyState />
            )}

            {!loading && !error && conferences.length > 0 && (
                <main className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-16">
                    <div className="container mx-auto max-w-6xl">
                        <ConferenceSelectionHeader />

                        <ConferenceSelectionList conferences={conferences} />
                    </div>
                </main>
            )}
        </>
    );
}