import { useEffect, useState } from "react";
import { Axios } from "../../../lib/api";
import { AddAddressButton } from "./addAddressButton";
import { useSelector } from "react-redux";
import { Card, CardBody, CardFooter, IconButton, Typography } from "@material-tailwind/react";
import { FaLocationDot } from "react-icons/fa6";
import { ChangeAddressButton } from "../../edit/changeAddressButton";
import { toast } from 'react-toastify';
import { DeleteAddressButton } from "./deleteAddress";
import { ChangeMainButton } from "./changeMainButton";
import { FaStar } from "react-icons/fa";
import { Search } from "../search";
import { FilterProvinceCity } from "../filterProvinceCity";

export function ManageAddress() {
    const user = useSelector((state) => state.user.value);
    const token = localStorage.getItem('token');
    const [addressList, setAddressList] = useState([])
    const [addressUpdate, setAddressUpdate] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [provinceFilter, setProvinceFilter] = useState('');
    const [cityFilter, setCityFilter] = useState('');

    const handleAddressUpdate = () => {
        setAddressUpdate(true)
    }

    const handleSort = (field) => {
        if (field === "" || field === " ") {
            return;
        }
        
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
        setCurrentPage(1);
    }

    const customerAddress = async () => {
        const config = {
            headers: { Authorization: `Bearer ${token}` },
            params: { page: currentPage, sortBy, sortOrder, searchTerm, province: provinceFilter, city: cityFilter }
        }
        try {
            const response = await Axios.get(`addresses/list/${user.id}`, config)
            setAddressList(response.data)
            setTotalPages(response.data.totalPages);
            toast.success("Success getting user address data!")
        } catch (error) {
            toast.error("Failed getting user address data!")
        } finally {
            setAddressUpdate(false)
        }
    }

    useEffect(() => {
        customerAddress()
    }, [addressUpdate, user, currentPage, sortBy, sortOrder, searchTerm, provinceFilter, cityFilter]);

    return (
        <div className="w-full flex flex-col mx-auto gap-2 lg:w-3/5">
            <AddAddressButton handleAddressUpdate={handleAddressUpdate} />
            <Card className="w-full flex flex-col mx-auto gap-5 border-solid border-brown-500 border-2 p-3">
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} setCurrentPage={setCurrentPage} />
                <FilterProvinceCity setProvinceFilter={setProvinceFilter} setCityFilter={setCityFilter} setCurrentPage={setCurrentPage} />
                {addressList.map((item) => 
                    <Card key={item.id} className={`border-solid border-2 ${item.isMain ? "border-green-600" : "border-gray-300"}`}>
                        <CardBody className="h-56 flex flex-col gap-2">
                            <div className="flex justify-between">
                                <div className="flex items-center gap-2">
                                    <FaLocationDot fontSize={'25px'} color={item.isMain ? "green" : "brown"}/>
                                    <Typography variant="h5" color="blue-gray">
                                        {item.label}
                                    </Typography>
                                </div>
                                {
                                    item.isMain ? 
                                    <IconButton variant="outlined" className="rounded-full">
                                        <FaStar color="green" fontSize={"20px"} />
                                    </IconButton> :
                                    <ChangeMainButton address={item} handleAddressUpdate={handleAddressUpdate} />
                                }
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
                        <CardFooter className="flex gap-2">
                            <ChangeAddressButton item={item} handleAddressUpdate={handleAddressUpdate} />
                            {
                                item.isMain ? "" : <DeleteAddressButton address={item} handleAddressUpdate={handleAddressUpdate} />
                            }   
                        </CardFooter>
                    </Card>
                )}
            </Card>
        </div>
    )
}
