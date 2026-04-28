type LatexCodeBlockProps = {
    value: string;
};

export function LatexCodeBlock({ value }: LatexCodeBlockProps) {
    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm text-gray-800">
            {value}
        </div>
    );
}