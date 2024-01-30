import { Card, Typography, List, ListItem, ListItemPrefix } from "@material-tailwind/react";
import Logo from "../../src/assets/Logo with name.png"
import { FaUserCircle, FaUsers, FaWarehouse, FaBox, FaBoxes, FaShoppingCart } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
 
export function SideBar() {
    const buttonList = [
        {
            icon: <FaUserCircle className="h-5 w-5" />,
            label: 'Profile',
            path: '/dashboard-admin/profile'
        },
        {
            icon: <FaUsers className="h-5 w-5" />,
            label: 'Users',
            path: '/dashboard-admin/user-lists'
        },
        {
            icon: <FaWarehouse className="h-5 w-5" />,
            label: 'Warehouse',
            path: '/dashboard-admin/warehouse'
        },
        {
            icon: <FaBox className="h-5 w-5" />,
            label: 'Products',
            path: '/dashboard-admin/products'
        },
        {
            icon: <FaBoxes className="h-5 w-5" />,
            label: 'Stocks',
            path: '/dashboard-admin/stocks'
        },
        {
            icon: <FaShoppingCart className="h-5 w-5" />,
            label: 'Orders',
            path: '/dashboard-admin/orders'
        },
        {
            icon: <GrTransaction className="h-5 w-5" />,
            label: 'Payments',
            path: '/dashboard-admin/payments'
        }
    ]
    return (
        <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
            <div className="mb-2 p-4">
                <img src={Logo} alt="logo" className="h-10" />
            </div>
            <List>
                {buttonList.map((item) => 
                    <ListItem key={item.label} href={item.path}>
                        <ListItemPrefix>
                            {item.icon}
                        </ListItemPrefix>
                        {item.label}
                    </ListItem>
                )}
            </List>
        </Card>
    );
}