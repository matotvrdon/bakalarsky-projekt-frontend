import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout.tsx";
import DashboardPage from "./pages/admin/DashboardPage.tsx";
import ConferencesPage from "./pages/admin/ConferencesPage.tsx";
import ConferenceDetailPage from "./pages/admin/ConferenceDetailPage.tsx";
import DaysPage from "./pages/admin/DaysPage.tsx";
import SessionsPage from "./pages/admin/SessionsPage.tsx";
import ThemesPage from "./pages/admin/ThemesPage.tsx";
import TalksPage from "./pages/admin/TalksPage.tsx";
import AttendeesPage from "./pages/admin/AttendeesPage.tsx";
import InvoicesPage from "./pages/admin/InvoicesPage.tsx";
import InvoiceItemsPage from "./pages/admin/InvoiceItemsPage.tsx";
import ProgramPage from "./pages/admin/ProgramPage.tsx";
import NavBarMenuPage from "./pages/admin/NavBarMenuPage.tsx";
import AdminPageContentPage from "./pages/admin/PageContentPage.tsx";
import PublicLayout from "./components/layout/PublicLayout.tsx";
import PublicPageContentPage from "./pages/public/PageContentPage.tsx";
const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* PUBLIC PAGES */}
                <Route element={<PublicLayout />}>
                    <Route index element={<PublicPageContentPage />} />
                    <Route path=":slug" element={<PublicPageContentPage />} />
                </Route>

                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="nav-bar" element={<NavBarMenuPage />} />
                    <Route path="content-pages" element={<AdminPageContentPage />} />
                    <Route path="conferences" element={<ConferencesPage />} />

                    {/* Conference detail */}
                    <Route path="conference/:id" element={<ConferenceDetailPage />} />

                    {/* Conference admin subsections */}
                    <Route path="conference/:id/days" element={<DaysPage />} />
                    <Route path="conference/:id/sessions" element={<SessionsPage />} />
                    <Route path="conference/:id/themes" element={<ThemesPage />} />
                    <Route path="conference/:id/talks" element={<TalksPage />} />
                    <Route path="/admin/program" element={<ProgramPage />}/>
                    <Route path="conference/:id/attendees" element={<AttendeesPage />} />
                    <Route path="conference/:id/invoices" element={<InvoicesPage />} />
                    <Route path="invoice-items" element={<InvoiceItemsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
