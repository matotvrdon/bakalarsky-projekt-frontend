export type BlockType =
    | "heading"
    | "text"
    | "button"
    | "hero";

export interface BaseBlock
{
    id: string;
    type: BlockType;
    enabled: boolean;
}

export interface HeadingBlock extends BaseBlock
{
    type: "heading";
    level: 1 | 2 | 3;
    text: string;
}

export interface TextBlock extends BaseBlock
{
    type: "text";
    html: string;
}

export interface ButtonBlock extends BaseBlock
{
    type: "button";
    text: string;
    href: string;
    variant: "primary" | "secondary";
    size: "small" | "medium" | "large";
}

export interface HeroBlock extends BaseBlock
{
    type: "hero";
    headline: string;
    subheadline: string;
}

export type CmsBlock =
    | HeadingBlock
    | TextBlock
    | ButtonBlock
    | HeroBlock;