import { Avatar, IconButton, Menu, MenuHandler, MenuItem, MenuList, MobileNav, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import { FaBell, FaCartShopping, FaHeart, FaUser } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { useSelector } from "react-redux";
import NullPhotoProfile from "../../../assets/null-profile-picture.png";

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

    const customerIcons = (
        <div className="hidden lg:block">
            <ul className="mt-2 mb-4 flex flex-col lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
                {customerIconButtons.map((item) => (
                    <IconButton variant="text" className="mx-1">
                        {item.icon}
                    </IconButton>
                ))}
            </ul>
        </div>
    )

    const customerMenuItems = [
        {
            label: "My Profile",
            icon: <FaUser />,
            path: '/my-profile'
        },
        {
            label: "Transaction",
            icon: <FaExchangeAlt />,
            path: '/transaction'
        },
        {
            label: "Cart",
            icon: <FaCartShopping />,
            path: '/cart'
        },
        {
            label: "Wishlist",
            icon: <FaHeart />,
            path: '/wishlist'
        },
        {
            label: "Log Out",
            icon: <FiLogOut color="red" />,
            path: ''
        },
    ];

    const customerMenu = (
        <MenuList className="p-1 flex flex-col">
            {customerMenuItems.map((item, key) => {
            const isLastItem = key === customerMenuItems.length - 1;
            return (
                <a href={item.path}>
                    <MenuItem
                        key={item.label}
                        onClick={ isLastItem ? handleLogOut : ""}
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
                </a>
            );
            })}
        </MenuList>
    );
    
    return (
        <div>
            <div className="flex items-center justify-center">
                {customerIcons}
                <div className="ml-5 block lg:hidden">
                    <IconButton variant="text">
                        <FaBell fontSize={'20px'} />
                    </IconButton>
                </div>
                <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
                    <MenuHandler>
                        <div className="flex items-center justify-center">
                            {
                                user.photoProfile == null ?
                                <Avatar size="sm" src={NullPhotoProfile} alt="photo profile" className="mx-6" /> :
                                <Avatar size="sm" src={`http://localhost:8000/${user.photoProfile}`} alt="avatar" className="mx-6" />
                            }
                        </div>
                    </MenuHandler>
                    {customerMenu}
                </Menu>
            </div>
        </div>
    )
}