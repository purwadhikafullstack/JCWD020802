import { Avatar, Badge, IconButton, Menu, MenuHandler, MenuItem, MenuList, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import { FaCartShopping, FaUser } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { useSelector } from "react-redux";
import NullPhotoProfile from "../../../assets/null-profile-picture.png";
import { useNavigate } from "react-router-dom";

export function CustomerNavButton() {
    const user = useSelector((state) => state.user.value);
    const quantity = useSelector((state) => state.cart.quantityValue)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate()

    const handleLogOut = async () => {
        try {
            localStorage.removeItem("token");
            window.location.reload();
        } catch (error) {
        }
    };

    const customerMenuItems = [
        {
            label: "My Profile",
            icon: <FaUser />,
            path: '/dashboard-customer'
        },
        {
            label: "Transaction",
            icon: <FaExchangeAlt />,
            path: '/transaction'
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
                    <MenuItem
                        key={item.label}
                        onClick={ isLastItem ? handleLogOut : () => navigate(item.path)}
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
    
    return (
        <div>
            <div className="flex items-center justify-center gap-2">
                <div className="ml-5 block">
                    {
                        quantity == 0 ?
                        <IconButton variant="text" onClick={() => navigate('/carts')}>
                            <FaCartShopping color="green" fontSize={'20px'} />
                        </IconButton> :
                        <Badge content={quantity} withBorder>
                            <IconButton variant="text" onClick={() => navigate('/carts')}>
                                <FaCartShopping color="green" fontSize={'20px'} />
                            </IconButton>
                        </Badge>
                    }
                </div>
                <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
                    <MenuHandler>
                        <div className="flex items-center justify-center">
                            {
                                user.photoProfile == null || user.photoProfile == '' ?
                                <Avatar size="sm" src={NullPhotoProfile} alt="photo profile" className="mx-6" /> :
                                <Avatar size="sm" src={`${import.meta.env.VITE_LOCAL_HOST}${user.photoProfile}`} alt="avatar" className="mx-6" />
                            }
                        </div>
                    </MenuHandler>
                    {customerMenu}
                </Menu>
            </div>
        </div>
    )
}