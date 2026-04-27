import type { SubmissionSettings } from "../types/submissionSettingsTypes.ts";

import { LinkText } from "./LinkText.tsx";
import { SectionCard } from "./SectionCard.tsx";
import { TextBlock } from "./TextBlock.tsx";

type FinalPaperSectionProps = {
    settings: SubmissionSettings | null;
};

const formatDeadline = (value?: string | null) => {
    if (!value) {
        return "neurčeného termínu";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("sk-SK", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

export function FinalPaperSection({ settings }: FinalPaperSectionProps) {
    return (
        <SectionCard title="Príprava a odoslanie finálneho príspevku">
            <TextBlock>
                Pred odoslaním finálneho príspevku musia autori použiť{" "}
                {settings?.ieeePdfExpressUrl ? (
                    <LinkText href={settings.ieeePdfExpressUrl}>
                        IEEE PDF eXpress
                    </LinkText>
                ) : (
                    <strong>IEEE PDF eXpress</strong>
                )}{" "}
                aby sa uistili, že príspevok je kompatibilný s IEEE Xplore.
                Ak spĺňa formát a požiadavky, bude zahrnutý do databázy IEEE
                Xplore po konferencii. ID konferencie je{" "}
                <strong className="text-red-600">
                    {settings?.conferenceCode || "Conference ID"}
                </strong>
                .
            </TextBlock>

            <TextBlock>
                Keď je status príspevku "Pass", kliknite na tlačidlo
                "Approve" v poli Action. Potom sa status zmení na
                "Approved".
            </TextBlock>

            <TextBlock>
                Stránka na odovzdanie finálnych príspevkov je otvorená do{" "}
                <strong>{formatDeadline(settings?.finalPaperDeadline)}</strong>.
                Žiadny príspevok nie je akceptovaný po tomto termíne. Autori
                môžu odoslať príspevok len raz, duplicitné príspevky nie sú
                akceptované.
            </TextBlock>

            <TextBlock>
                Nahrajte schválenú verziu PDF do{" "}
                {settings?.easyChairUrl ? (
                    <LinkText href={settings.easyChairUrl}>
                        EasyChair systému
                    </LinkText>
                ) : (
                    <strong>EasyChair systému</strong>
                )}
                .
            </TextBlock>
        </SectionCard>
    );
}