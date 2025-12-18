import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../admin/AdminSidebar";
import "../../styles/admin.css";

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="admin-layout">
            {/* Mobile menu button */}
            <button
                className="admin-menu-btn"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open menu"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
            </button>

            {/* Overlay */}
            <div
                className={`admin-overlay ${sidebarOpen ? 'open' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;