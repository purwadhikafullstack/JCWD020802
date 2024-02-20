import React, { useEffect, useState } from "react";
import { Dialog, DialogBody, DialogFooter, Button, Card, CardBody, Typography, CardFooter, Select, Option, DialogHeader } from "@material-tailwind/react"
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Axios } from "../../lib/api";
import { FaLocationDot } from "react-icons/fa6";
import { Search } from "../dashboard/search";
import { FilterProvinceCity } from "../dashboard/address/filterProvinceCity";
import { PaginationButton } from "../paginationButton";

export function ChangeAddressButton ({ onSelectAddress, setSelectedCourier, setServices, setSelectedService }) {
    const user = useSelector((state) => state.user.value);
    const token = localStorage.getItem('token');
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [addressList, setAddressList] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [provinceFilter, setProvinceFilter] = useState('');
    const [cityFilter, setCityFilter] = useState('');

    const sortFieldOptions = [
        { label: "No Sort", value: null },
        { label: "Label", value: "label" },
        { label: "Province", value: "province" },
        { label: "City", value: "city_name" },
    ];

    const sortOrderOptions = [
        { label: "No Order", value: null },
        { label: "Ascending", value: "asc" },
        { label: "Descending", value: "desc" },
    ];

    const handleSort = (value) => {
        setSortBy(value);
        setCurrentPage(1);
    }

    const handleOrder = (value) => {
        setSortOrder(value);
        setCurrentPage(1);
    }

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleSelectAddress = (selectedAddress) => {
        onSelectAddress(selectedAddress);
        setSelectedCourier(null);
        setServices(null);
        setSelectedService(null);
        handleCloseDialog();
    };

    const customerAddress = async () => {
        const config = {
            headers: { Authorization: `Bearer ${token}` },
            params: { page: currentPage, sortBy, sortOrder, searchTerm, province: provinceFilter, city: cityFilter }
        }
        try {
            const response = await Axios.get(`addresses/list/${user.id}`, config)

            let sortedAddresses = response.data.addresses;

            if (!sortBy && !sortOrder) {
                sortedAddresses = sortedAddresses.sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0));
            }

            setAddressList(response.data.addresses)
            setTotalPages(response.data.totalPages);
        } catch (error) {
            toast.error("Failed getting user address data!")
        }
    }

    useEffect(() => {
        if (isDialogOpen) {
            customerAddress()
        }
    }, [isDialogOpen, user, currentPage, sortBy, sortOrder, searchTerm, provinceFilter, cityFilter]);

    return (
        <>
            <Button
                className="w-full my-4"
                color="green"
                onClick={handleOpenDialog}
            >
                Change Address
            </Button>
            <Dialog size="lg" open={isDialogOpen} handler={handleCloseDialog}>
                <DialogHeader>Change Shipping Address</DialogHeader>
                <DialogBody className="overflow-y-auto max-h-[500px] flex flex-col gap-2">
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} setCurrentPage={setCurrentPage} />
                    <FilterProvinceCity setProvinceFilter={setProvinceFilter} setCityFilter={setCityFilter} setCurrentPage={setCurrentPage} />
                    <div className="flex gap-2">
                        <Select label="Sort By" color="green" onChange={handleSort}>
                            {sortFieldOptions.map((option) => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                        <Select label="Order By" color="green" onChange={handleOrder}>
                            {sortOrderOptions.map((option) => (
                                <Option key={option.value} value={option.value}>
                                    {option.label}
                                </Option>
                            ))}
                        </Select>
                    </div>
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
                    <div className="flex items-center justify-center">
                        <PaginationButton currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button color="red" onClick={handleCloseDialog}>
                        Close
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
};