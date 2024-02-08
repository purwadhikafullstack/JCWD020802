import { Avatar, Button, Drawer, IconButton, Menu, MenuHandler, MenuItem, MenuList, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import { FaCartShopping, FaUser } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { useSelector } from "react-redux";
import NullPhotoProfile from "../../../assets/null-profile-picture.png";
import { Axios } from "../../../lib/api";
import { toast } from "react-toastify";

export function CustomerNavButton() {
    const user = useSelector((state) => state.user.value);
    const token = localStorage.getItem('token');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [count, setCount] =useState(null)

    const handleOrderCount = async () => {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        }
        try {
            const data = await Axios.get("carts/", config)
            setCount(data.count)
            toast.success("Successfully adding item!")
        } catch (error) {
            toast.error("Failed adding item!")
        }
    }

    useEffect(() => {
        handleOrderCount()
    }, [])

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
            <div className="flex items-center justify-center gap-2">
                <div className="ml-5 block">
                    <a href="/carts">
                        <IconButton variant="text">
                            <FaCartShopping fontSize={'20px'} />
                        </IconButton>
                    </a>
                </div>
                <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
                    <MenuHandler>
                        <div className="flex items-center justify-center">
                            {
                                user.photoProfile == null || user.photoProfile == '' ?
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