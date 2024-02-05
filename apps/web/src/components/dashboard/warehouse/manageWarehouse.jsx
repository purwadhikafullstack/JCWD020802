import { Card, Typography } from "@material-tailwind/react";
import { FaWarehouse } from "react-icons/fa";
import { AddWarehouseButton } from "./addWarehouseButton";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { EditWarehouseAddressButton } from "../../edit/editWarehouseAddressButton";
import { Axios } from "../../../lib/api";
import { MoveToTrashWarehouse } from "./moveToTrashWarehouse";
import { FilterProvinceCity } from "../filterProvinceCity";
import { FaArrowDownShortWide, FaArrowDownUpAcrossLine, FaArrowUpShortWide } from "react-icons/fa6";
import { PaginationButton } from "../../paginationButton";
import { Search } from "../search";

export function ManageWarehouse() {
    const adminToken = localStorage.getItem('adminToken');
    const [warehouseList, setWarehouseList] = useState([])
    const [warehouseUpdate, setWarehouseUpdate] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [provinceFilter, setProvinceFilter] = useState('');
    const [cityFilter, setCityFilter] = useState('');

    const tableHead = ["Name", "Province", "City", "Address", " ", ""];

    const handleWarehouseUpdate = () => {
        setWarehouseUpdate(true)
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

    const fetchWarehouse = async () => {
        const config = {
            headers: { Authorization: `Bearer ${adminToken}` },
            params: { page: currentPage, sortBy, sortOrder, searchTerm, province: provinceFilter, city: cityFilter }
        }
        try {
            const response = await Axios.get("warehouses/list", config)
            setWarehouseList(response.data.warehouses)
            setTotalPages(response.data.totalPages);
            toast.success("Success getting warehouse address data!")
        } catch (error) {
            if (error.response.status == 400) {
                toast.error('Error Token')
            } else if (error.response.status == 401) {
                toast.error('Unauthorize (Super Admin only)!')
            } else {
                toast.error("Failed getting warehouse address data!")
            } 
        } finally {
            setWarehouseUpdate(false)
        }
    }

    useEffect(() => {
        fetchWarehouse()
    }, [warehouseUpdate, currentPage, sortBy, sortOrder, searchTerm, provinceFilter, cityFilter]);

    return (
        <div className="h-screen flex flex-col gap-1">
            <div className="flex w-full items-center gap-3 pt-2 pl-2">
                <FaWarehouse fontSize={'30px'} />
                <Typography variant="h3" color="blue-gray">Manage Warehouse</Typography>
            </div>
            <Card className="h-full py-4 px-4 flex flex-col gap-4">
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} setCurrentPage={setCurrentPage} />
                <div className="w-full flex flex-col items-center justify-center gap-2 md:flex-row">
                    <FilterProvinceCity setProvinceFilter={setProvinceFilter} setCityFilter={setCityFilter} setCurrentPage={setCurrentPage} />
                    <AddWarehouseButton handleWarehouseUpdate={handleWarehouseUpdate} />
                </div>
                <Card className="h-fit w-full overflow-scroll">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {tableHead.map((head) => (
                                <th
                                    key={head}
                                    className="cursor-pointer border-b border-2 border-green-600 bg-green-800"
                                    onClick={() => handleSort(head.toLowerCase())}
                                >
                                    <div className="flex items-center justify-between p-4">
                                        <Typography
                                            variant="lead"
                                            color="white"
                                            className="font-bold text-sm leading-none"
                                        >
                                            {head}
                                        </Typography>
                                        {sortBy === head.toLowerCase() && (
                                            <span>
                                                {
                                                    sortOrder === null ? <FaArrowDownUpAcrossLine color="white" /> : 
                                                    sortOrder === 'asc' ? <FaArrowUpShortWide color="white" /> : <FaArrowDownShortWide color="white" />
                                                }
                                            </span>
                                        )}
                                    </div>
                                </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {warehouseList.map((warehouse) => {
                                const classes = "p-4 border-b border-green-600";
                                return (
                                    <tr key={warehouse.id}>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {warehouse.label}
                                            </Typography>
                                        </td>
                                        <td className={`${classes} bg-green-50/50`}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {warehouse.City.Province.province}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {warehouse.City.city_name}
                                            </Typography>
                                        </td>
                                        <td className={`${classes} bg-green-50/50`}>
                                            <Typography
                                                as="a"
                                                href="#"
                                                variant="small"
                                                color="blue-gray"
                                                className="font-medium"
                                            >
                                                {warehouse.address}
                                            </Typography>
                                        </td>
                                        <td className={`${classes}`}>
                                            <div className="flex justify-center">
                                                <EditWarehouseAddressButton warehouse={warehouse} handleWarehouseUpdate={handleWarehouseUpdate} />
                                            </div>
                                        </td>
                                        <td className={`${classes} bg-green-50/50`}>
                                            <div className="flex justify-center">
                                                <MoveToTrashWarehouse warehouse={warehouse} handleWarehouseUpdate={handleWarehouseUpdate} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </Card>
                <div className="flex items-center justify-center">
                    <PaginationButton currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
                </div>
            </Card>
        </div>
    )
}