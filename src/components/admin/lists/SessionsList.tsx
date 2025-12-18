import type { Day } from "../../../types/types";
import { AdminList, AdminCard, AdminEmpty, AdminButton, Section } from "../ui";

type Props = {
    days: Day[];
    onDelete: (id: number) => void;
};

export default function SessionsList({ days, onDelete }: Props) {
    if (days.length === 0) {
        return <AdminEmpty>No days created</AdminEmpty>;
    }

    return (
        <>
            {days.map((day) => (
                <Section key={day.id} title={day.date}>
                    {(day.session ?? []).filter(Boolean).length === 0 ? (
                        <AdminEmpty>No sessions for this day</AdminEmpty>
                    ) : (
                        <AdminList>
                            {(day.session ?? []).filter(Boolean).map((s) => (
                                <AdminCard
                                    key={s!.id}
                                    title={s!.title}
                                    subtitle={`${s!.startTime} – ${s!.endTime}`}
                                    actions={
                                        <AdminButton variant="danger" onClick={() => onDelete(s!.id)}>
                                            Delete
                                        </AdminButton>
                                    }
                                />
                            ))}
                        </AdminList>
                    )}
                </Section>
            ))}
        </>
    );
}

