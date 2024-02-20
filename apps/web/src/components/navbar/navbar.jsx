import React, {useState, useEffect} from "react";
import {
  Navbar,
  MobileNav,
  IconButton,
  Button,
  Typography
} from "@material-tailwind/react";
import { FaSearch } from "react-icons/fa";
import Logo from "../../assets/Logo with name.png";
import MobileLogo from "../../assets/Logo.png";
import { Search } from "./subComponents/search";
import { CustomerNavButton } from "./subComponents/customerNavButton";
import { Login } from "./login/login";
import { RegisterEmail } from "./register/registerEmail";
import { useNavigate } from "react-router-dom";
 
export function NavBar() {
  const token = localStorage.getItem("token")
  const [openNav, setOpenNav] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const navigate = useNavigate()
 
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
          <Button color="white" className="border-2 rounded-full py-1 hidden sm:flex" onClick={() => navigate('/')}>
            <img src={Logo} alt="logo" className="h-8 w-40" />
          </Button>
            <img src={MobileLogo} alt="logo" className="h-12 sm:hidden cursor-pointer border-2 rounded-full p-2" onClick={() => navigate('/')} />
          <div className="mx-5">
            <Button color="green" variant="text" size="sm" onClick={() => navigate('/products')}>
              <Typography
                variant="small"
                className="font-bold"
              >
                Products
              </Typography>
            </Button>
          </div>
          <div className="relative w-full hidden lg:block">
            <Search />
          </div>
        </div>
        <div className="flex items-center">
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
              <div className="ml-5 flex items-center gap-x-1">
                <Login />
                <RegisterEmail />
              </div>
            </div>
          }
        </div>
      </div>
      <MobileNav open={openNav}>
        {
          token ?
          '' :
          <div className="flex flex-col items-center gap-y-1">
            <Login />
            <RegisterEmail />
          </div>
        }
      </MobileNav>
      <MobileNav open={openSearch}>
        <div fullWidth className="relative mt-5">
          <Search />
        </div>
      </MobileNav>
    </Navbar>
  );
}