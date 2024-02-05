import { Card } from "@material-tailwind/react";
import { ManageUser } from "../components/dashboard/user/manageUser";
import { ManageProductAndCategory } from "../components/dashboard/product/manageProductAndCategory";
import { ManageStock } from "../components/dashboard/stock/manageStock";
import { Order } from "../components/dashboard/order";
import { Payment } from "../components/dashboard/payment";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminProfile } from "../components/dashboard/profileAdmin";
import { SideBar } from "../components/dashboard/sidebar";
import { ManageWarehouse } from "../components/dashboard/warehouse/manageWarehouse";

const Components = ({ match }) => {
    const { path } = match;

    switch (path) {
        case "/dashboard-admin":
            return <AdminProfile />;
        case "/dashboard-admin/user":
            return <ManageUser />;
        case "/dashboard-admin/warehouse":
            return <ManageWarehouse />;
        case "/dashboard-admin/products":
            return <ManageProductAndCategory />;
        case "/dashboard-admin/stocks":
            return <ManageStock />;
        case "/dashboard-admin/orders":
            return <Order />;
        case "/dashboard-admin/payments":
            return <Payment />;
        default:
            return null;
    }
};

export function DashboardAdmin() {
    const location = useLocation()
    const navigate = useNavigate();

    const { pathname } = location;
    const handleNavigation = (path) => { navigate(path) };

    return (
        <div className="flex h-screen bg-gray-100">
            <SideBar onNavigate={handleNavigation} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Card className="flex-1 mx-2 overflow-x-hidden overflow-y-auto bg-gray-200">
                    <Components match={{path: pathname}} />
                </Card>
            </div>
        </div>
    );
}
