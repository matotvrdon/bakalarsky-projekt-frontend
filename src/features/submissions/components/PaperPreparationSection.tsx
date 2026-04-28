import type { SubmissionSettings } from "../types/submissionSettingsTypes.ts";

import { submissionSteps } from "../data/submissionsContent.ts";

import { LatexCodeBlock } from "./LatexCodeBlock.tsx";
import { LinkText } from "./LinkText.tsx";
import { SectionCard } from "./SectionCard.tsx";
import { SubmissionStepList } from "./SubmissionStepList.tsx";
import { TextBlock } from "./TextBlock.tsx";

type PaperPreparationSectionProps = {
    settings: SubmissionSettings | null;
};

export function PaperPreparationSection({
                                            settings,
                                        }: PaperPreparationSectionProps) {
    const maxPages = settings?.maxPages ?? 6;
    const extraPagePrice = settings?.extraPagePrice ?? 10;
    const abstractMinWords = settings?.abstractMinWords ?? 150;

    return (
        <SectionCard title="Príprava príspevku">
            <TextBlock>
                Odoslané príspevky by mali obsahovať pôvodné nepublikované
                výsledky v téme konferencie.{" "}
                <strong>
                    Príspevky by nemali prekročiť {maxPages} strán
                </strong>
                . Extra strany stoja {extraPagePrice}€ za stranu. Všetky
                príspevky prejdú peer review procesom a každý príspevok bude
                posúdený dvoma recenzentmi.
            </TextBlock>

            <TextBlock>
                Príspevky sú určené na publikovanie v IEEE šablóne. Autori
                môžu použiť buď LaTeX <em>(preferované)</em> alebo Microsoft
                Word{" "}
                {settings?.ieeeTemplateUrl ? (
                    <LinkText href={settings.ieeeTemplateUrl}>
                        šablónu od IEEE
                    </LinkText>
                ) : (
                    <strong>šablónu od IEEE</strong>
                )}
                . Pre Word verziu by ste mali vybrať{" "}
                <strong>A4 verziu</strong> šablóny.
            </TextBlock>

            {settings?.latexExample ? (
                <LatexCodeBlock value={settings.latexExample} />
            ) : null}

            <TextBlock className="text-sm text-gray-600">
                Pre viac informácií pozri dokumentáciu šablóny.
            </TextBlock>

            <TextBlock>
                Príspevky sú spravované cez{" "}
                {settings?.easyChairUrl ? (
                    <LinkText href={settings.easyChairUrl}>
                        EasyChair systém
                    </LinkText>
                ) : (
                    <strong>EasyChair systém</strong>
                )}
                . Proces odoslania príspevku pozostáva z dvoch krokov:
            </TextBlock>

            <SubmissionStepList
                steps={submissionSteps.map((step, index) =>
                    index === 0
                        ? {
                            ...step,
                            description: step.description.replace(
                                "150 slov",
                                `${abstractMinWords} slov`
                            ),
                        }
                        : step
                )}
            />
        </SectionCard>
    );
}