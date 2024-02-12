import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Tooltip, Typography } from "@material-tailwind/react";
import { FaTrash } from "react-icons/fa";
import { Axios } from "../../../lib/api";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useState } from "react";

export function MoveToTrashProduct({ product, handleProductUpdate }) {
    const adminToken = localStorage.getItem('adminToken');
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const handleOpen = () => setOpen(!open);

    const handleMoveToTrash = async () => {
        const config = {
            headers: { Authorization: `Bearer ${adminToken}` }
        }
        try {
            setIsLoading(true)
            await Axios.patch(`products/move-to-trash/${product.id}`, {}, config)
            handleOpen()
            handleProductUpdate()
            toast.success('Product moved to trash!')
        } catch (error) {
            handleOpen()
            if (error.response.status == 400) {
                toast.error('Error Token')
            } else if (error.response.status == 401) {
                toast.error('Unauthorize (Super Admin only)!')
            } else if (error.response.status == 402) {
                toast.error("Product doesn't exist!")
            } else {
                toast.error("Failed moving Product data to trash!")
            } 
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Tooltip content={"Move to Trash"}>
                <IconButton onClick={handleOpen} variant="text" className="bg-red-600 hover:bg-red-300">
                    <FaTrash color="white" fontSize={"20px"} />
                </IconButton>
            </Tooltip>
            <Dialog open={open} handler={handleOpen} className="flex flex-col max-h-full overflow-y-scroll">
                <DialogHeader className="flex items-center justify-center">
                    Delete Product
                </DialogHeader>
                <DialogBody>
                    <Typography variant="lead">
                        Are you sure you want to move this Product data to Trash?
                    </Typography>
                </DialogBody>
                <DialogFooter className="flex justify-between">
                    <Button onClick={handleOpen} className="bg-red-600 hover:bg-red-300">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleMoveToTrash}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-300"
                    >
                        {
                            isLoading ? 
                            <ClipLoader size={20} color={"#fff"} loading={isLoading} /> : 
                            "Confirm"
                        }
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    )
}