export function ConferenceSelectionLoadingState() {
    return (
        <main className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-16">
            <div className="container mx-auto max-w-5xl">
                <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                        Načítavam dostupné konferencie...
                    </p>
                </div>
            </div>
        </main>
    );
}