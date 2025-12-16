import { Outlet } from "react-router-dom";
import AdminSidebar from "../../pages/admin/AdminSidebar.tsx";
import styles from "../../styles/AdminLayout.module.css";

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