import React from "react";
import { Drawer, IconButton, List, ListItem, ListItemPrefix, Typography } from "@material-tailwind/react";
import Logo from "../../assets/Logo with name.png"
import { FaUserCircle, FaUsers, FaWarehouse, FaBox, FaBoxes, FaShoppingCart } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { IoMenu } from "react-icons/io5";
 
export function SideBar() {
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
        },
        {
            icon: <FiLogOut className="h-5 w-5" color="red" />,
            label: 'Log Out',
            path: '/'
        },
    ]

    const handleLogOut = async () => {
        try {
            localStorage.removeItem("adminToken");
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <React.Fragment>
            <IconButton>

            </IconButton>
            <Drawer className="p-4">
                <div className="p-4">
                    <img src={Logo} alt="logo" className="h-10" />
                </div>
                <List>
                    {buttonList.map((item, key) => {
                        const isLastItem = key === buttonList.length - 1;
                        return (
                            <Link to={item.path}>
                                <ListItem 
                                    key={item.label}
                                    onClick={ isLastItem ? handleLogOut : ""}
                                    className={`my-2${
                                        isLastItem
                                        ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                                        : ""
                                    }`}
                                >
                                    <ListItemPrefix>{item.icon}</ListItemPrefix>
                                    <Typography
                                        as="span"
                                        variant="small"
                                        className="font-normal"
                                        color={isLastItem ? "red" : "inherit"}
                                    >
                                        {item.label}
                                    </Typography>
                                </ListItem>
                            </Link>
                        )

                    })}
                </List>
            </Drawer>
        </React.Fragment>
    );
}