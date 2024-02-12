import { Card, IconButton, List, ListItem, ListItemPrefix, Tooltip, Typography } from "@material-tailwind/react";
import Logo from "../../assets/Logo with name.png"
import IconLogo from "../../assets/Logo.png";
import { FaUserCircle, FaUsers, FaWarehouse, FaBox, FaBoxes, FaShoppingCart } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useSelector } from "react-redux";
 
export function SideBar() {
    const user = useSelector((state) => state.user.value)

    const buttonList = [
        {
            icon: <FaUserCircle className="h-5 w-5" />,
            label: 'Profile',
            path: '/dashboard-admin'
        },
        {
            icon: <FaUsers className="h-5 w-5" />,
            label: 'Users',
            path: '/dashboard-admin/user'
        },
        {
            icon: <FaWarehouse className="h-5 w-5" />,
            label: 'Warehouse',
            path: '/dashboard-admin/warehouse'
        },
        {
            icon: <FaBox className="h-5 w-5" />,
            label: 'Products & Category',
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
        },
        {
            icon: <FiLogOut className="h-5 w-5" color="red" />,
            label: 'Log Out',
            path: '/'
        },
    ]

    const isWHAdmin = user.role === 'Warehouse Admin';

    const filteredButtonList = buttonList.filter(
        (item) => !isWHAdmin || item.label !== 'Users' && item.label !== 'Warehouse'
    );

    const handleLogOut = async () => {
        try {
            localStorage.removeItem("adminToken");
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    const dashboardNav = (
        <>
            <List>
            <div className="py-4 w-11 flex items-center justify-center lg:w-full">
                <img src={Logo} alt="logo" className="hidden h-10 lg:flex" />
                <img src={IconLogo} alt="logo" className="flex h-10 lg:hidden" />
            </div>
                {filteredButtonList.map((item, key) => {
                    const isLastItem = key === filteredButtonList.length - 1;
                    return (
                        <Link to={item.path} className="w-fit lg:w-full">
                            <ListItem 
                                key={item.label}
                                onClick={ isLastItem ? handleLogOut : ""}
                                className={`my-2 ${
                                    isLastItem
                                    ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                                    : ""
                                }`}
                            >
                                <ListItemPrefix className="hidden lg:flex">{item.icon}</ListItemPrefix>
                                <Typography
                                    as="span"
                                    variant="small"
                                    className="hidden font-normal lg:flex"
                                    color={isLastItem ? "red" : "inherit"}
                                >
                                    {item.label}
                                </Typography>
                                <Tooltip content={item.label} placement="right">
                                    <IconButton variant="text" size="sm" className="flex h-5 w-5 lg:hidden">{item.icon}</IconButton>
                                </Tooltip>
                            </ListItem>
                        </Link>
                    )

                })}
            </List>
        </>
    )
    

    return (
        <Card className="h-full w-20 shadow-xl shadow-blue-gray-900/5 lg:w-fit">
            {dashboardNav}
        </Card>
    );
}