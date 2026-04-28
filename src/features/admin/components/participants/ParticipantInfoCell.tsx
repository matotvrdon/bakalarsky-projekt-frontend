import type { Participant } from "../../types/adminTypes.ts";

type ParticipantInfoCellProps = {
    participant: Participant;
};

export function ParticipantInfoCell({
                                        participant,
                                    }: ParticipantInfoCellProps) {
    return (
        <div>
            <div className="font-medium text-gray-900">
                {participant.fullName}
            </div>

            <div className="text-xs text-gray-500">
                ID: {participant.id}
            </div>
        </div>
    );
}