import { IconButton, Tooltip } from "@material-tailwind/react";
import { HiMiniPencilSquare } from "react-icons/hi2";

export function EditButton ({ tooltip, handleOpen }) {
    return (
        <Tooltip content={tooltip}>
            <IconButton onClick={handleOpen} variant="text" className="bg-green-600 hover:bg-green-300">
                <HiMiniPencilSquare color="white" fontSize={"20px"} />
            </IconButton>
        </Tooltip>
    )
}