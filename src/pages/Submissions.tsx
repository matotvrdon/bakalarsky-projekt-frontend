import {
    FinalPaperSection,
    ImportantInfoCard,
    PaperPreparationSection,
    SubmissionsHeader,
} from "../features/submissions/components/index.ts";

import { useSubmissionSettings } from "../features/submissions/hooks/useSubmissionSettings.ts";

export function Submissions() {
    const { data: settings, loading, error } = useSubmissionSettings();

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto max-w-6xl px-4">
                <SubmissionsHeader />

                {loading ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">
                        Načítavam nastavenia príspevkov...
                    </div>
                ) : null}

                {!loading && error ? (
                    <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                        {error}
                    </div>
                ) : null}

                {!loading ? (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="space-y-8 lg:col-span-2">
                            <FinalPaperSection settings={settings} />
                            <PaperPreparationSection settings={settings} />
                        </div>

                        <div className="space-y-6">
                            <ImportantInfoCard />
                        </div>
                    </div>
                ) : null}
            </div>
        </main>
    );
}