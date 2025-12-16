import {Outlet} from "react-router-dom";
import {Header} from "./Header.tsx";
import {Footer} from "./Footer.tsx";

const PublicLayout = () => {
    return (
        <>
            <Header />
            <main style={{ minHeight: "calc(100vh - 140px)" }}>
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default PublicLayout;