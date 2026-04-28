type CommitteesErrorStateProps = {
    message: string;
};

export function CommitteesErrorState({
                                         message,
                                     }: CommitteesErrorStateProps) {
    return (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm font-medium text-red-700 shadow-sm">
            {message}
        </div>
    );
}