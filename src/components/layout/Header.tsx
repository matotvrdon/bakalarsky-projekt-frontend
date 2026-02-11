import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "../../styles/header.module.css";
import { getAllNavBarMenus } from "../../api/navBarMenuApi";
import type { NavBarMenu } from "../../types/types";
import { buildNavPath, isMenuActive } from "../../utils/navBar";

const STATIC_NAV_ITEMS = [
    { key: "admin", label: "ADMIN", path: "/admin" },
];

export const Header: React.FC = () => {
    const [menuItems, setMenuItems] = useState<NavBarMenu[]>([]);

    useEffect(() => {
        let isMounted = true;
        getAllNavBarMenus()
            .then((data) => {
                if (!isMounted) return;
                setMenuItems(Array.isArray(data) ? data : []);
            })
            .catch((error) => {
                console.error("Failed to load nav bar menu.", error);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const dynamicItems = menuItems
        .filter((item) => isMenuActive(item.isActive))
        .filter((item) => item.name.trim().toLowerCase() !== "admin")
        .map((item) => ({
            key: `nav-${item.id}`,
            label: item.name,
            path: buildNavPath(item.name),
        }));

    const navItems = [...STATIC_NAV_ITEMS, ...dynamicItems];

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
                    {navItems.map((item) => (
                        <NavLink
                            key={item.key}
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
                    <button className={styles.registerButton}>
                        Register
                    </button>
                </nav>

                {/* Register button */}
            </div>
        </header>
    );
};
