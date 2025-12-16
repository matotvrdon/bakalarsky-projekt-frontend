import React from "react";
import { NavLink } from "react-router-dom";
import styles from "../../styles/header.module.css";

const NAV_ITEMS = [
    { label: "ADMIN", path: "/admin" },
    { label: "OVERVIEW", path: "/" },
    { label: "PROGRAM", path: "/program" },
    { label: "SUBMISSIONS", path: "/submissions" },
    { label: "COMMITTEES", path: "/committees" },
    { label: "PHOTOS", path: "/photos" },
    { label: "EVERGREEN", path: "/evergreen" },
];

export const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                {/* Logo blok */}
                <div className={styles.logoBlock}>
                    <div className={styles.logoIcon}>I</div>
                    <div className={styles.logoText}>
                        <span className={styles.logoTitle}>INFORMATICS</span>
                        <span className={styles.logoSubtitle}>&apos;24 CONFERENCE</span>
                    </div>
                </div>

                {/* Navigácia */}
                <nav className={styles.nav}>
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/"}
                            className={({ isActive }) =>
                                isActive
                                    ? `${styles.navItem} ${styles.navItemActive}`
                                    : styles.navItem
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Register button */}
                <button className={styles.registerButton}>
                    Register
                </button>
            </div>
        </header>
    );
};