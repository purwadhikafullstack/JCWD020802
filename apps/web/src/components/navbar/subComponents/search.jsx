import { Input } from "@material-tailwind/react";
import { FiSearch } from "react-icons/fi";

export function Search() {
    return (
        <Input
            type="search"
            placeholder="Search..."
            className="!border !border-brown-300"
            labelProps={{
                className: "hidden",
            }}
            containerProps={{
                className: "min-w-[288px]",
            }}
            icon={<FiSearch fontSize={"20px"} color="brown" />}
        />
    )
}