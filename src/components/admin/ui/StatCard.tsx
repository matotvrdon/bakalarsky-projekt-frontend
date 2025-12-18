type Props = {
    label: string;
    value: number;
};

export default function StatCard({ label, value }: Props) {
    return (
        <div className="admin-card">
            <h3>{label}</h3>
            <p>{value}</p>
        </div>
    );
}

