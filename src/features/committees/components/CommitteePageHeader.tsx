type CommitteePageHeaderProps = {
    conferenceName?: string;
};

export function CommitteePageHeader({
                                        conferenceName,
                                    }: CommitteePageHeaderProps) {
    return (
        <header className="mb-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
                {conferenceName || "Aktívna konferencia"}
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                Komisie
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
                Prehľad odborných, programových a organizačných komisií aktívnej konferencie.
            </p>
        </header>
    );
}