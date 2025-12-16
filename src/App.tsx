import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import DashboardPage from "./pages/admin/pages/DashboardPage.tsx";
import ConferencesPage from "./pages/admin/pages/ConferencesPage.tsx";
import ConferenceDetailPage from "./pages/admin/pages/ConferenceDetailPage.tsx";
import DaysPage from "./pages/admin/pages/DaysPage.tsx";
import SessionsPage from "./pages/admin/pages/SessionsPage.tsx";
import ThemesPage from "./pages/admin/pages/ThemesPage.tsx";
import TalksPage from "./pages/admin/pages/TalksPage.tsx";
import AttendeesPage from "./pages/admin/pages/AttendeesPage.tsx";
import InvoicesPage from "./pages/admin/pages/InvoicesPage.tsx";
import InvoiceItemsPage from "./pages/admin/pages/InvoiceItemsPage.tsx";
import ProgramPage from "./pages/admin/pages/ProgramPage.tsx";
import OverviewPage from "./pages/overview/OverviewPage.tsx";
import CommitteesPage from "./pages/committees/CommitteesPage.tsx";
import SubmissionsPage from "./pages/submissions/SubmissionsPage.tsx";
import PhotosPage from "./pages/photos/PhotosPage.tsx";
import EvergreenPage from "./pages/evergreen/EvergreenPage.tsx";
import PublicLayout from "./components/layout/PublicLayout.tsx";
import ProgramMenuPage from "./pages/program/ProgramMenuPage.tsx";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* PUBLIC PAGES */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<OverviewPage />} />
                    <Route path="/program" element={<ProgramMenuPage />} />
                    <Route path="/committees" element={<CommitteesPage />} />
                    <Route path="/submissions" element={<SubmissionsPage />} />
                    <Route path="/photos" element={<PhotosPage />} />
                    <Route path="/evergreen" element={<EvergreenPage />} />
                </Route>

                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<DashboardPage />} />
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