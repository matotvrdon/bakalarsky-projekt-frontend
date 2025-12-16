import React from "react";
import styles from "../../styles/footer.module.css";

export const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                © 2025 Martin Tvrdoň
            </div>
        </footer>
    );
};