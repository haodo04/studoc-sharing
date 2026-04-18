import { UserButton } from "@clerk/clerk-react";
import DashboardLayout from "../components/layout/DashboardLayout";

const Dashboard = () => {
    return (
        <DashboardLayout activeMenu="Dashboard">
            <div>
                Dashboard content
            </div>
        </DashboardLayout>
    )
}

export default Dashboard;