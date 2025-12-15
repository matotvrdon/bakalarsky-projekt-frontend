import React from "react";
import { Header } from "../../components/layout/Header.tsx";
import { Footer } from "../../components/layout/Footer.tsx";
import {CmsContent} from "../CmsContent.tsx";

interface PageProps {
    title: string;
}

export const ProgramPage: React.FC<PageProps> = () => {
    return (
        <>
            <Header />
            <CmsContent slug="overview" />
            <Footer />
        </>
    );
};