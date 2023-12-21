import React, {useState, useEffect} from "react";
import {
  Navbar,
  MobileNav,
  IconButton
} from "@material-tailwind/react";
import { FaSearch } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import Logo from "../../assets/Logo with name.png";
import { LoginRegisterButttons } from "./subComponents/loginRegisterButton";
import { MobileLoginRegisterButttons } from "./mobileSubComponents/mobileLoginRegisterButtons";
import { Search } from "./subComponents/search";
import { NavList } from "./subComponents/navList";
import { CustomerNavButton } from "./subComponents/customerNavButton";
import { MobileCustomerButtons } from "./mobileSubComponents/mobileCustomerButton";
 
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
          <img src={Logo} alt="nature image" className="h-10" />
          <div className="relative w-full mx-5 hidden lg:block">
            <Search />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <NavList />
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenSearch(!openSearch)}
          >
            <FaSearch fontSize={"20px"} />
          </IconButton>
          <IconButton
            variant="text"
            className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={false}
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? <FiX fontSize={"20px"} /> : <FiMenu fontSize={"20px"} />}
          </IconButton>
          { token ? 
            <CustomerNavButton /> :
            <LoginRegisterButttons />
          }
        </div>
      </div>
      <MobileNav open={openSearch}>
        <div fullWidth className="relative mt-5">
          <Search />
        </div>
      </MobileNav>
      <MobileNav open={openNav}>
        { token ? 
          <MobileCustomerButtons list={<NavList />}/> :
          <MobileLoginRegisterButttons list={<NavList />}/>
        }
      </MobileNav>
    </Navbar>
  );
}