import { useParams } from "react-router-dom";
import { Header } from "../../../components/layout/Header";
import { Footer } from "../../../components/layout/Footer";
import styles from "../../overview/OverviewPage.module.css";
import {CmsContent} from "../../CmsContent.tsx";

export default function PagePreviewPage() {
    const { slug } = useParams();

    if (!slug) return null;

    return (
        <div className={styles.wrapper}>
            <Header />

            <main className={styles.main}>
                <div style={{
                    background: "#fef3c7",
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 24,
                    fontWeight: 600
                }}>
                    PREVIEW MODE – Draft content
                </div>

                <CmsContent slug={slug} preview />
            </main>

            <Footer />
        </div>
    );
}