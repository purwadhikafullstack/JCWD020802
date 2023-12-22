import React, {useState, useEffect} from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
  Input,
  Avatar
} from "@material-tailwind/react";
import { FiSearch, FiMenu, FiX, FiInbox, FiSettings, FiLogOut } from "react-icons/fi";
import { FaCartShopping, FaBell, FaInbox } from "react-icons/fa6";
import Logo from "../../assets/Logo with name.png";
 
export function NavBarNotRegistered() {
  const [openNav, setOpenNav] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
 
  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false) && setOpenSearch(false),
    );
  }, []);

  const buttonList = [
    {name: 'Home', path: '/'},
    {name: 'Products', path: '/products'},
    {name: 'Categories', path: '/categories'}
  ]
 
  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
        {buttonList.map((item) => (
          <Typography
              as="li"
              variant="small"
              color="blue-gray"
              className="p-1 font-normal"
          >
              <a href={item.path} className="flex items-center">{item.name}</a>
          </Typography>
        ))}
    </ul>
  );

  const profileMenuItems = [
    {
      label: "Settings",
      icon: <FiSettings />,
    },
    {
      label: "Log Out",
      icon: <FiLogOut />,
    },
  ];

  const profileMenuIconButtons = [
    {
      label: "Cart",
      icon: <FaCartShopping />,
    },
    {
      label: "Notification",
      icon: <FaBell />,
    },
    {
      label: "Inbox",
      icon: <FaInbox />,
    },
  ];
 
  return (
    <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-8 py-4">
      <div className="flex items-center justify-between text-blue-gray-900">
        <div className="flex items-center w-full">
          <img src={Logo} alt="nature image" className="h-10" />
          <div className="relative w-full mx-5 hidden lg:block">
            <Input
              type="search"
              placeholder="Search..."
              className="!border !border-brown-300 bg-white text-brown-900 shadow-lg shadow-brown-900/5 ring-4 ring-transparent placeholder:text-brown-500 focus:!border-brown-900 focus:!border-t-brown-900 focus:ring-brown-900/10 pr-10"
              labelProps={{
                className: "hidden",
              }}
              containerProps={{
                className: "min-w-[288px]",
              }}
              icon={<FiSearch fontSize={"20px"} color="brown" />}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="mr-4 hidden lg:block">{navList}</div>
          
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenSearch(!openSearch)}
          >
            <FiSearch fontSize={"20px"} />
          </IconButton>
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? <FiX fontSize={"20px"} /> : <FiMenu fontSize={"20px"} />}
          </IconButton>
        </div>
      </div>
      <MobileNav open={openSearch}>
        <div fullWidth className="relative mt-5">
          <Input
            type="search"
            color="black"
            label="Search"
            placeholder="Search..."
            className="pr-20"
            containerProps={{
              className: "min-w-[288px]",
            }}
            icon={<FiSearch fontSize={"20px"} />}
          />
        </div>
      </MobileNav>
      <MobileNav open={openNav}>
        <div className="mt-5">
          {navList}
          <div className="flex items-center gap-x-1">
            <Button fullWidth variant="outlined" size="sm" className="">
              <span>Log In</span>
            </Button>
            <Button fullWidth variant="gradient" size="sm" className="">
              <span>Sign Up</span>
            </Button>
          </div>
        </div>
      </MobileNav>
    </Navbar>
  );
}