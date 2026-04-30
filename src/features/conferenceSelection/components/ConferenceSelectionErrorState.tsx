type ConferenceSelectionErrorStateProps = {
    message: string;
};

export function ConferenceSelectionErrorState({
                                                  message,
                                              }: ConferenceSelectionErrorStateProps) {
    return (
        <main className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-16">
            <div className="container mx-auto max-w-5xl">
                <div className="rounded-3xl border border-red-200 bg-white p-10 text-center shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Nastala chyba
                    </h1>

                    <p className="mt-3 text-gray-600">
                        {message}
                    </p>
                </div>
            </div>
        </main>
    );
}