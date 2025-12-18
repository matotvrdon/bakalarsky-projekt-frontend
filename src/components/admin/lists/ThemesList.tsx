import type { Day } from "../../../types/types";
import { AdminList, AdminCard, AdminEmpty, AdminButton, Section, SubSection } from "../ui";

type Props = {
    days: Day[];
    onDelete: (id: number) => void;
};

export default function ThemesList({ days, onDelete }: Props) {
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
                        (day.session ?? []).filter(Boolean).map((session) => (
                            <SubSection
                                key={session!.id}
                                title={session!.title}
                                time={`${session!.startTime} – ${session!.endTime}`}
                            >
                                {(session!.theme ?? []).filter(Boolean).length === 0 ? (
                                    <AdminEmpty>No themes in this session</AdminEmpty>
                                ) : (
                                    <AdminList>
                                        {(session!.theme ?? []).filter(Boolean).map((t) => (
                                            <AdminCard
                                                key={t!.id}
                                                title={t!.title}
                                                subtitle={`${t!.startTime} – ${t!.endTime} • Chair: ${t!.chair}`}
                                                actions={
                                                    <AdminButton variant="danger" onClick={() => onDelete(t!.id)}>
                                                        Delete
                                                    </AdminButton>
                                                }
                                            />
                                        ))}
                                    </AdminList>
                                )}
                            </SubSection>
                        ))
                    )}
                </Section>
            ))}
        </>
    );
}

