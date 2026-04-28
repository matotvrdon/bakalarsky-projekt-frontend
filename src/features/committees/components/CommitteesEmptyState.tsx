export function CommitteesEmptyState() {
    return (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
                Komisie zatiaľ nie sú zadané
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-600">
                Po pridaní komisií do databázy alebo neskôr cez admin rozhranie sa zobrazia na tejto stránke.
            </p>
        </div>
    );
}