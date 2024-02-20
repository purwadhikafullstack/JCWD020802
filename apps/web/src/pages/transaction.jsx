import { Typography } from "@material-tailwind/react";
import { NavBar } from "../components/navbar/navbar";
import { Footer } from "../components/footer";

export function Transaction() {
    return (
        <div className="flex flex-col justify-between h-screen">
            <div className="bg-gray-100">
                <NavBar />
                <div className="mx-auto pt-2 px-0 lg:px-2 w-full bg-white md:w-4/5 lg:w-3/5">
                    <Typography variant="h1" className="text-center">This is Transaction Page</Typography>
                </div>
            </div>
            <Footer />
        </div>
    )
}