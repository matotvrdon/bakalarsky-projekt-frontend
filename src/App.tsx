import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { OverviewRoute } from "./pages/overview/OverviewRoute.tsx";
import { ProgramRoute } from "./pages/program/ProgramRoute";
import { SubmissionsRoute } from "./pages/submissions/SubmissionsRoute";
import { CommitteesRoute } from "./pages/committees/CommitteesRoute";
import { PhotosRoute } from "./pages/photos/PhotosRoute";
import { EvergreenRoute } from "./pages/evergreen/EvergreenRoute";
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
import PagePreviewPage from "./pages/admin/pages/PagePreviewPage.tsx";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<OverviewRoute />} />
                <Route path="/program" element={<ProgramRoute />} />
                <Route path="/submissions" element={<SubmissionsRoute />} />
                <Route path="/committees" element={<CommitteesRoute />} />
                <Route path="/photos" element={<PhotosRoute />} />
                <Route path="/evergreen" element={<EvergreenRoute />} />

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
                    <Route path="/admin/preview/:slug" element={<PagePreviewPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;