import type { Day } from "../../../types/types";
import { AdminList, AdminCard, AdminEmpty, AdminButton } from "../ui";

type Props = {
    days: Day[];
    onDelete: (id: number) => void;
};

export default function DaysList({ days, onDelete }: Props) {
    if (days.length === 0) {
        return <AdminEmpty>No days created</AdminEmpty>;
    }

    return (
        <AdminList>
            {days.map((d) => (
                <AdminCard
                    key={d.id}
                    title={d.date}
                    actions={
                        <AdminButton variant="danger" onClick={() => onDelete(d.id)}>
                            Delete
                        </AdminButton>
                    }
                />
            ))}
        </AdminList>
    );
}

