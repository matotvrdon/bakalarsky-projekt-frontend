export function ConferenceSelectionEmptyState() {
    return (
        <main className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-16">
            <div className="container mx-auto max-w-5xl">
                <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Momentálne nie je dostupná žiadna konferencia
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Žiadna konferencia nie je aktuálne zverejnená ako aktívna.
                    </p>
                </div>
            </div>
        </main>
    );
}