type InvoicesErrorBoxProps = {
    message: string;
};

export function InvoicesErrorBox({ message }: InvoicesErrorBoxProps) {
    if (!message) {
        return null;
    }

    return (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {message}
        </div>
    );
}