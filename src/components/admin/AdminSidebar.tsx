import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/admin.css";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const AdminSidebar = ({ isOpen, onClose }: Props) => {
    const [selectedConferenceId, setSelectedConferenceId] = useState<string | null>(
        localStorage.getItem("admin.selectedConferenceId")
    );

    useEffect(() => {
        const handleStorageChange = () => {
            setSelectedConferenceId(localStorage.getItem("admin.selectedConferenceId"));
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("conferenceSelected", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("conferenceSelected", handleStorageChange);
        };
    }, []);

    const handleLinkClick = () => {
        onClose();
    };

    const handleConferencesClick = () => {
        localStorage.removeItem("admin.selectedConferenceId");
        setSelectedConferenceId(null);
        handleLinkClick();
    };

    return (
        <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="admin-logo">
                <span>ADMIN</span>
                <button className="admin-close-btn" onClick={onClose} aria-label="Close menu">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <nav className="admin-nav">
                <NavLink
                    to="/admin"
                    end
                    onClick={handleLinkClick}
                    className={({ isActive }) => `admin-link ${isActive ? 'admin-link--active' : ''}`}
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/admin/conferences"
                    onClick={handleConferencesClick}
                    className={({ isActive }) => `admin-link ${isActive ? 'admin-link--active' : ''}`}
                >
                    Conferences
                </NavLink>

                {selectedConferenceId && (
                    <>
                        <div className="admin-separator" />

                        <NavLink
                            to={`/admin/conference/${selectedConferenceId}`}
                            end
                            onClick={handleLinkClick}
                            className={({ isActive }) => `admin-link ${isActive ? 'admin-link--active' : ''}`}
                        >
                            Overview
                        </NavLink>

                        <NavLink
                            to={`/admin/conference/${selectedConferenceId}/days`}
                            end
                            onClick={handleLinkClick}
                            className={({ isActive }) => `admin-link ${isActive ? 'admin-link--active' : ''}`}
                        >
                            Days
                        </NavLink>

                        <NavLink
                            to={`/admin/conference/${selectedConferenceId}/sessions`}
                            end
                            onClick={handleLinkClick}
                            className={({ isActive }) => `admin-link ${isActive ? 'admin-link--active' : ''}`}
                        >
                            Sessions
                        </NavLink>

                        <NavLink
                            to={`/admin/conference/${selectedConferenceId}/themes`}
                            end
                            onClick={handleLinkClick}
                            className={({ isActive }) => `admin-link ${isActive ? 'admin-link--active' : ''}`}
                        >
                            Themes
                        </NavLink>

                        <NavLink
                            to={`/admin/conference/${selectedConferenceId}/talks`}
                            end
                            onClick={handleLinkClick}
                            className={({ isActive }) => `admin-link ${isActive ? 'admin-link--active' : ''}`}
                        >
                            Talks
                        </NavLink>

                        <NavLink
                            to="/admin/program"
                            end
                            onClick={handleLinkClick}
                            className={({ isActive }) => `admin-link ${isActive ? 'admin-link--active' : ''}`}
                        >
                            Program
                        </NavLink>

                        <div className="admin-separator" />

                        <NavLink
                            to={`/admin/conference/${selectedConferenceId}/attendees`}
                            end
                            onClick={handleLinkClick}
                            className={({ isActive }) => `admin-link ${isActive ? 'admin-link--active' : ''}`}
                        >
                            Attendees
                        </NavLink>

                        <NavLink
                            to={`/admin/conference/${selectedConferenceId}/invoices`}
                            end
                            onClick={handleLinkClick}
                            className={({ isActive }) => `admin-link ${isActive ? 'admin-link--active' : ''}`}
                        >
                            Invoices
                        </NavLink>

                        <NavLink
                            to="/admin/invoice-items"
                            end
                            onClick={handleLinkClick}
                            className={({ isActive }) => `admin-link ${isActive ? 'admin-link--active' : ''}`}
                        >
                            Invoice Items
                        </NavLink>
                    </>
                )}
            </nav>

            <div className="admin-sidebar-footer">
                <NavLink to="/" className="admin-link-home" onClick={handleLinkClick}>
                    ← Back to Website
                </NavLink>
            </div>
        </aside>
    );
};

export default AdminSidebar;
