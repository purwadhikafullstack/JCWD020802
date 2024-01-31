import { Card } from "@material-tailwind/react";
import { SideBar } from "../components/sidebar";
import { UserLists } from "../components/dashboard/userLists";
import { Warehouse } from "../components/dashboard/warehouse";
import { Product } from "../components/dashboard/product";
import { Stock } from "../components/dashboard/stock";
import { Order } from "../components/dashboard/order";
import { Payment } from "../components/dashboard/payment";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminProfile } from "../components/dashboard/profileAdmin";

const Components = ({ match }) => {
    const { path } = match;

    switch (path) {
        case "/dashboard-admin/profile":
            return <AdminProfile />;
        case "/dashboard-admin/user-lists":
            return <UserLists />;
        case "/dashboard-admin/warehouse":
            return <Warehouse />;
        case "/dashboard-admin/products":
            return <Product />;
        case "/dashboard-admin/stocks":
            return <Stock />;
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
                <Card className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 py-8">
                    <Components match={{path: pathname}} />
                </Card>
            </div>
        </div>
    );
}
