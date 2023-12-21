import { Avatar, Button, IconButton, Menu, MenuHandler, MenuItem, MenuList, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { FaExchangeAlt, FaSignOutAlt } from "react-icons/fa";
import { FaBell, FaCartShopping, FaHeart, FaUser } from "react-icons/fa6";
import { HiChevronDown } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { useSelector } from "react-redux";

export function CustomerNavButton() {
    const user = useSelector((state) => state.user.value);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const closeMenu = () => setIsMenuOpen(false)

    const handleLogOut = async () => {
        try {
        localStorage.removeItem("token");
        window.location.reload();
        } catch (error) {
        console.log(error);
        }
    };

    const customerMenuItems = [
        {
            label: "My Profile",
            icon: <FaUser />,
            handle: closeMenu
        },
        {
            label: "Transaction",
            icon: <FaExchangeAlt />,
            handle: closeMenu
        },
        {
            label: "Log Out",
            icon: <FaSignOutAlt />,
            handle: handleLogOut
        },
    ];

    const customerMenu = (
        <MenuList className="p-1">
            {customerMenuItems.map((item, key) => {
            const isLastItem = key === customerMenuItems.length - 1;
            return (
                <MenuItem
                key={item.label}
                onClick={item.handle}
                //   href={}
                className={`flex items-center gap-2 rounded ${
                    isLastItem
                    ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                    : ""
                }`}
                >
                {item.icon}
                <Typography
                    as="span"
                    variant="small"
                    className="font-normal"
                    color={isLastItem ? "red" : "inherit"}
                >
                    {item.label}
                </Typography>
                </MenuItem>
            );
            })}
        </MenuList>
    );

    const customerIconButtons = [
        {
            label: "Cart",
            icon: <FaCartShopping fontSize={'20px'} />,
        },
        {
            label: "Wishlist",
            icon: <FaHeart fontSize={'20px'} />,
        },
        {
            label: "Notification",
            icon: <FaBell fontSize={'20px'} />,
        }
    ];

    const customerNavList = (
        <div className="mr-4 hidden lg:block">
            <ul className="mt-2 mb-4 flex flex-col lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
                {customerIconButtons.map((item) => (
                    <IconButton variant="text" className="mx-1">
                        {item.icon}
                    </IconButton>
                ))}
            </ul>
        </div>
    )

    const mobileCustomerMenuItems = [
        {
            label: "My Profile",
            icon: <FaUser />,
        },
        {
            label: "Transaction",
            icon: <FaExchangeAlt />,
        },
        {
            label: "Cart",
            icon: <FaCartShopping />,
        },
        {
            label: "Wishlist",
            icon: <FaHeart />,
        },
        {
            label: "Log Out",
            icon: <FiLogOut />,
        },
    ];
    return (
        <div className="flex">
            {customerNavList}
            <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
                <MenuHandler>
                    <Avatar size="sm" src="https://docs.material-tailwind.com/img/face-2.jpg" alt="avatar" className="mr-5" />
                </MenuHandler>
                {customerMenu}
            </Menu>
        </div>
    )
}