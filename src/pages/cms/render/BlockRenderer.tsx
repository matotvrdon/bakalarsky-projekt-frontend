import React from "react";
import type { CmsBlock } from "../types";
import { blockMap } from "./blockMap";

export const BlockRenderer: React.FC<{ blocks: CmsBlock[] }> = ({ blocks }) => {
    return (
        <>
            {blocks
                .filter(b => b.enabled !== false)
                .map(b => {
                    const Component = blockMap[b.type];
                    if (!Component) return null;
                    return <Component key={b.id} {...b} />;
                })}
        </>
    );
};