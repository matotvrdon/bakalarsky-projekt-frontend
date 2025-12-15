import {CmsContent} from "../CmsContent.tsx";
import {Header} from "../../components/layout/Header.tsx";
import {Footer} from "../../components/layout/Footer.tsx";

export const OverviewPage: React.FC = () => {
    return (
        <>
            <Header />
            <CmsContent slug="overview" />
            <Footer />
        </>
    );
};