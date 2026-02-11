import {
    AdminPage,
    AdminHeader,
    AdminList,
    AdminCard
} from "../../components/admin/ui";

const DashboardPage = () => {
    return (
        <AdminPage>
            <AdminHeader
                title="Dashboard"
                subtitle="Keep the experience clear and consistent for every attendee."
            />

            <AdminList>
                <AdminCard
                    title="Welcome back"
                    subtitle="Small updates here make the whole site feel polished."
                >
                    <p>
                        Focus on one task, ship it, then move to the next.
                        You are building a conference experience people will remember.
                    </p>
                </AdminCard>
            </AdminList>
        </AdminPage>
    );
};

export default DashboardPage;
