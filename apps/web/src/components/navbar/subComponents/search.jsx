import { Input } from "@material-tailwind/react";
import { FiSearch } from "react-icons/fi";

export function Search() {
    return (
        <Input
            type="search"
            placeholder="Search..."
            className="!border !border-green-400 rounded-full"
            labelProps={{
                className: "hidden",
            }}
            containerProps={{
                className: "min-w-[288px]",
            }}
            icon={<FiSearch fontSize={"20px"} color="green" />}
        />
        
    )
}