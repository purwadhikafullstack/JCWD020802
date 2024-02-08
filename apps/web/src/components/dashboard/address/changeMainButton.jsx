import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, IconButton, Tooltip, Typography } from "@material-tailwind/react";
import { FaStar } from "react-icons/fa";
import { Axios } from "../../../lib/api";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useState } from "react";
import { useSelector } from "react-redux";

export function ChangeMainButton({ address, handleAddressUpdate }) {
    const user = useSelector((state) => state.user.value);
    const token = localStorage.getItem('token');
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const handleOpen = () => setOpen(!open);

    const handleChange = async () => {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        }
        try {
            setIsLoading(true)
            await Axios.patch(`addresses/change-main/${address.id}`, { UserId: user.id }, config)
            handleOpen()
            handleAddressUpdate()
            toast.success('Address successfully changed into main address!')
        } catch (error) {
            handleOpen()
            if (error.response.status == 400) {
                toast.error('Error Token')
            } else if (error.response.status == 401) {
                toast.error('Unauthorize (Super Admin only)!')
            } else if (error.response.status == 402) {
                toast.error("Address doesn't exist!")
            } else {
                toast.error("Failed changing main address!")
            } 
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Tooltip content={"Change to Main"}>
                <IconButton onClick={handleOpen} variant="text">
                    <FaStar color="brown" fontSize={"20px"} />
                </IconButton>
            </Tooltip>
            <Dialog open={open} handler={handleOpen} className="flex flex-col max-h-full overflow-y-scroll">
                <DialogHeader className="flex items-center justify-center">
                    Delete Address
                </DialogHeader>
                <DialogBody>
                    <Typography variant="lead">
                        Are you sure you want to change this address to main address?
                    </Typography>
                </DialogBody>
                <DialogFooter className="flex justify-between">
                    <Button onClick={handleOpen} className="bg-red-600 hover:bg-red-300">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleChange}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-300"
                    >
                        {
                            isLoading ? 
                            <ClipLoader size={20} color={"#fff"} loading={isLoading} /> : 
                            "Change"
                        }
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    )
}