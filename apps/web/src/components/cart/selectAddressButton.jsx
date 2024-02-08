import React, { useEffect, useState } from "react";
import { Dialog, DialogBody, DialogFooter, Button, Card, CardBody, Typography, CardFooter } from "@material-tailwind/react"
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Axios } from "../../lib/api";
import { FaLocationDot } from "react-icons/fa6";

const SelectAddressButton = ({ onSelectAddress }) => {
    const user = useSelector((state) => state.user.value);
    const token = localStorage.getItem('token');
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [addressList, setAddressList] = useState([])

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleSelectAddress = (selectedAddress) => {
        onSelectAddress(selectedAddress);
        handleCloseDialog();
    };

    const customerAddress = async () => {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        }
        try {
            const response = await Axios.get(`addresses/customer/${user.id}`, config)
            setAddressList(response.data)
            toast.success("Success getting user address data!")
        } catch (error) {
            console.log(error);
            toast.error("Failed getting user address data!")
        }
    }

    useEffect(() => {
        if (isDialogOpen) {
            customerAddress()
        }
    }, [isDialogOpen]);

    return (
        <>
            <Button
                className="w-full my-4"
                type="button"
                onClick={handleOpenDialog}
            >
                Select Address
            </Button>
            <Dialog size="lg" open={isDialogOpen} handler={handleCloseDialog}>
                <DialogBody className="overflow-y-auto max-h-[500px]">
                    {addressList.map((item) => 
                        <Card key={item.id} className={`border-solid border-2 ${item.isMain ? "border-green-600" : "border-gray-300"}`}>
                            <CardBody className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <FaLocationDot fontSize={'25px'} color={item.isMain ? "green" : "brown"}/>
                                    <Typography variant="h5" color="blue-gray">
                                        {item.label}
                                    </Typography>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Typography variant="h6" color="blue-gray" className="w-1/4 flex justify-between">
                                        <div>Province</div>
                                        <div>:</div>
                                    </Typography>
                                    <Typography variant="paragraph" color="blue-gray" className="w-3/4 font-normal">
                                        {item.City.Province.province}
                                    </Typography>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Typography variant="h6" color="blue-gray" className="w-1/4 flex justify-between">
                                        <div>City</div>
                                        <div>:</div>
                                    </Typography>
                                    <Typography variant="paragraph" color="blue-gray" className="w-3/4 font-normal">
                                        {item.City.city_name}
                                    </Typography>
                                </div>
                                <div className="flex gap-2">
                                    <Typography variant="h6" color="blue-gray" className="w-1/4 flex justify-between">
                                        <div>Address</div>
                                        <div>:</div>
                                    </Typography>
                                    <Typography variant="paragraph" color="blue-gray" className="w-3/4 font-normal line-clamp-2">
                                        {item.address}
                                    </Typography>
                                </div>
                                <div className="flex gap-2">
                                    <Typography variant="small" color="blue-gray" className="font-bold w-1/4 flex justify-between">
                                        <div>Note</div>
                                        <div>:</div>
                                    </Typography>
                                    <Typography variant="small" color="blue-gray" className="w-3/4 font-normal line-clamp-2">
                                        {item.note == '' ? 'No Note' : item.note}
                                    </Typography>
                                </div>
                            </CardBody>
                            <CardFooter>
                                <Button color="green" onClick={() => handleSelectAddress(item)}>
                                    Select
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </DialogBody>
                <DialogFooter>
                    <Button color="blue" onClick={handleCloseDialog}>
                        Close
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
};

export default SelectAddressButton;
