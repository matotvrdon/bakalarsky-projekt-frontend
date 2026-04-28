type SubmissionStep = {
    title: string;
    description: string;
};

type SubmissionStepListProps = {
    steps: SubmissionStep[];
};

export function SubmissionStepList({ steps }: SubmissionStepListProps) {
    return (
        <ol className="ml-5 list-decimal space-y-3 text-gray-700">
            {steps.map((step) => (
                <li key={step.title} className="leading-7">
                    <strong>{step.title}</strong> – {step.description}
                </li>
            ))}
        </ol>
    );
}