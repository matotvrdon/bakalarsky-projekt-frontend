import type {CmsBlock} from "../types.ts";
import { HeroBlock } from "../blocks/HeroBlockForm.tsx";
import { HeadingBlock } from "../blocks/HeadingBlockForm.tsx";
import { TextBlock } from "../blocks/TextBlockForm.tsx";
import { ButtonBlock } from "../blocks/ButtonBlockForm.tsx";

export const blockMap: Record<CmsBlock["type"], React.FC<any>> = {
    hero: HeroBlock,
    heading: HeadingBlock,
    text: TextBlock,
    button: ButtonBlock
}