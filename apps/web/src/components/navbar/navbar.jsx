import React, {useState, useEffect} from "react";
import {
  Navbar,
  MobileNav,
  IconButton
} from "@material-tailwind/react";
import { FaSearch } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import Logo from "../../assets/Logo with name.png";
import { Search } from "./subComponents/search";
import { NavList } from "./subComponents/navListButton";
import { CustomerNavButton } from "./subComponents/customerNavButton";
import { Login } from "./login/login";
import { RegisterEmail } from "./register/registerEmail";
 
export function NavBar() {
  const token = localStorage.getItem("token")
  const [openNav, setOpenNav] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
 
  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false) && setOpenSearch(false),
    );
  }, []);
 
  return (
    <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-8 py-4">
      <div className="flex items-center justify-between text-blue-gray-900">
        <div className="flex items-center w-full">
          <a href="/">
            <img src={Logo} alt="nature image" className="h-10" />
          </a>
          <div className="relative w-full mx-5 hidden lg:block">
            <Search />
          </div>
        </div>
        <div className="flex items-center">
          <div className="mr-4 hidden lg:block">
            <NavList />
          </div>
          <IconButton
            variant="text"
            className="mx-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenSearch(!openSearch)}
            >
            <FaSearch fontSize={"20px"} />
          </IconButton>
          { 
            token ? <CustomerNavButton /> : 
            <div className="hidden lg:flex">
              <div className="flex items-center gap-x-1">
                <Login />
                <RegisterEmail />
              </div>
            </div>
          }
          <IconButton
            variant="text"
            className="h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? <FiX fontSize={"20px"} /> : <FiMenu fontSize={"20px"} />}
          </IconButton>
        </div>
      </div>
      <MobileNav open={openSearch}>
        <div fullWidth className="relative mt-5">
          <Search />
        </div>
      </MobileNav>
      <MobileNav open={openNav}>
          <div className="mt-5">
            <NavList />
            <div className="flex flex-col items-center gap-y-1">
              <Login />
              <RegisterEmail />
            </div>
        </div>
      </MobileNav>
    </Navbar>
  );
}