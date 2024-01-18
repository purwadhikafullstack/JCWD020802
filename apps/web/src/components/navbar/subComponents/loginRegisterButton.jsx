import React, { useState } from "react";
import { 
    Button,
    Dialog
} from "@material-tailwind/react";
import { Login } from "../login/login";
import { RegisterEmail } from "../registerEmail";

export function LoginRegisterButttons() {
    const [openLogin, setOpenLogin] = useState(false);
    const [openRegister, setOpenRegister] = useState(false);

    const handleOpenLogin = () => setOpenLogin((cur) => !cur);
    const handleOpenRegister = () => setOpenRegister((cur) => !cur);

    return (
        <div className="flex items-center gap-x-1">
            <Button
                variant="outlined"
                size="sm"
                color="brown"
                className="w-full lg:w-24"
                onClick={handleOpenLogin}
            >
                <span>Log In</span>
            </Button>
            <Dialog
                size="sm"
                open={openLogin}
                handler={handleOpenLogin}
                className="bg-transparent shadow-none"
            >
                <Login />
            </Dialog>
            <Button
                variant="gradient"
                size="sm"
                color="brown"
                className="w-full lg:w-24"
                onClick={handleOpenRegister}
            >
                <span>Register</span>
            </Button>
            <Dialog
                size="sm"
                open={openRegister}
                handler={handleOpenRegister}
                className="bg-transparent shadow-none"
            >
                <RegisterEmail />
            </Dialog>
        </div>
    )
}