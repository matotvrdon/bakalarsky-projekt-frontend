import { NavLink, useNavigate } from "react-router-dom";
import styles from "../../styles/AdminSidebar.module.css";

const AdminSidebar = () => {
    const navigate = useNavigate();

    const selected = localStorage.getItem("admin.selectedConferenceId");

    const goToConferences = () => {
        localStorage.removeItem("admin.selectedConferenceId");
        navigate("/admin/conferences");
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>ADMIN</div>

            <nav className={styles.nav}>
                <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) =>
                        isActive ? styles.active : styles.link
                    }
                >
                    Dashboard
                </NavLink>

                <div onClick={goToConferences} className={styles.link}>
                    Conferences
                </div>

                {selected && (
                    <>
                        <NavLink
                            to={`/admin/conference/${selected}`}
                            end
                            className={({ isActive }) =>
                                isActive ? styles.active : styles.link
                            }
                        >
                            Conference Overview
                        </NavLink>

                        <NavLink
                            to={`/admin/conference/${selected}/days`}
                            end
                            className={({ isActive }) =>
                                isActive ? styles.active : styles.link
                            }
                        >
                            Days
                        </NavLink>

                        <NavLink
                            to={`/admin/conference/${selected}/sessions`}
                            end
                            className={({ isActive }) =>
                                isActive ? styles.active : styles.link
                            }
                        >
                            Sessions
                        </NavLink>

                        <NavLink
                            to={`/admin/conference/${selected}/themes`}
                            end
                            className={({ isActive }) =>
                                isActive ? styles.active : styles.link
                            }
                        >
                            Themes
                        </NavLink>

                        <NavLink
                            to={`/admin/conference/${selected}/talks`}
                            end
                            className={({ isActive }) =>
                                isActive ? styles.active : styles.link
                            }
                        >
                            Talks
                        </NavLink>

                        <NavLink
                            to="/admin/program"
                            end
                            className={({ isActive }) =>
                                isActive ? styles.active : styles.link
                            }
                        >
                            Program
                        </NavLink>

                        <NavLink
                            to={`/admin/conference/${selected}/attendees`}
                            end
                            className={({ isActive }) =>
                                isActive ? styles.active : styles.link
                            }
                        >
                            Attendees
                        </NavLink>

                        <NavLink
                            to={`/admin/conference/${selected}/invoices`}
                            end
                            className={({ isActive }) =>
                                isActive ? styles.active : styles.link
                            }
                        >
                            Invoices
                        </NavLink>

                        <NavLink
                            to="/admin/invoice-items"
                            end
                            className={({ isActive }) =>
                                isActive ? styles.active : styles.link
                            }
                        >
                            Invoice Items
                        </NavLink>
                    </>
                )}
            </nav>

            <div className={styles.separator}></div>

            <NavLink to="/" className={styles.linkHome}>
                ← Back to Website
            </NavLink>
        </aside>
    );
};

export default AdminSidebar;