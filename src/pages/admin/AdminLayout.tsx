import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.tsx";
import styles from "./AdminLayout.module.css";

const AdminLayout = () => {
    return (
        <div className={styles.wrapper}>
            <AdminSidebar />
            <main className={styles.content}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;