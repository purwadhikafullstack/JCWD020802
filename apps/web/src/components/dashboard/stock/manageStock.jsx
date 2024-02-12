import { Card, Typography } from "@material-tailwind/react";
import { FaBoxes } from "react-icons/fa";
import { AddNewStockButton } from "./addNewStockButton";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Axios } from "../../../lib/api";
import { EditWarehouseAddressButton } from "../../edit/editWarehouseAddressButton";
import { FaArrowDownShortWide, FaArrowDownUpAcrossLine, FaArrowUpShortWide } from "react-icons/fa6";
import { PaginationButton } from "../../paginationButton";
import { Search } from "../search";
import { FilterWarehouse } from "./filterWarehouse";
import { FilterProduct } from "./filterProduct";
import { MoveToTrashStock } from "./moveToTrashStock";
import { EditStockButton } from "../../edit/editStockButton";

export function ManageStock() {
    const adminToken = localStorage.getItem('adminToken');
    const [stockList, setStockList] = useState([])
    const [stockUpdate, setStockUpdate] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [warehouseFilter, setWarehouseFilter] = useState('');
    const [productFilter, setProductFilter] = useState('');

    const tableHead = ["Warehouse", "Product", "Stock", " ", ""];

    const handleStockUpdate = () => {
        setStockUpdate(true)
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

    const fetchStock = async () => {
        const config = {
            headers: { Authorization: `Bearer ${adminToken}` },
            params: { page: currentPage, sortBy, sortOrder, searchTerm, warehouse: warehouseFilter, product: productFilter }
        }
        try {
            const response = await Axios.get("stocks/", config)
            setStockList(response.data.stocks)
            setTotalPages(response.data.totalPages);
            toast.success("Success getting stock data!")
        } catch (error) {
            if (error.response.status == 400) {
                toast.error('Error Token')
            } else if (error.response.status == 401) {
                toast.error('Unauthorize (Super Admin only)!')
            } else if (error.response.status == 402) {
                toast.error("Warehouse didn't exist!")
            } else if (error.response.status == 403) {
                toast.error("Product didn't exist!")
            } else {
                toast.error("Failed getting stock data!")
            } 
        } finally {
            setStockUpdate(false)
        }
    }

    useEffect(() => {
        fetchStock()
    }, [stockUpdate, currentPage, sortBy, sortOrder, searchTerm, warehouseFilter, productFilter]);

    return (
        <div className="h-screen flex flex-col gap-1">
            <div className="flex w-full items-center gap-3 pt-2 pl-2">
                <FaBoxes fontSize={'30px'} />
                <Typography variant="h3" color="blue-gray">Manage Stock</Typography>
            </div>
            <Card className="h-full py-4 px-4 flex flex-col gap-4">
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} setCurrentPage={setCurrentPage} />
                <div className="w-full flex flex-col items-center justify-center gap-2 md:flex-row">
                    <FilterWarehouse setWarehouseFilter={setWarehouseFilter} setCurrentPage={setCurrentPage} />
                    <FilterProduct setProductFilter={setProductFilter} setCurrentPage={setCurrentPage} />
                    <AddNewStockButton handleStockUpdate={handleStockUpdate} />
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
                            {stockList.map((stock) => {
                                const classes = "p-4 border-b border-green-600";
                                return (
                                    <tr key={stock.id}>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {stock.Warehouse.label}
                                            </Typography>
                                        </td>
                                        <td className={`${classes} bg-green-50/50`}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {stock.Product.productName}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {stock.stock}
                                            </Typography>
                                        </td>
                                        <td className={`${classes} bg-green-50/50`}>
                                            <div className="flex justify-center">
                                                <EditStockButton stock={stock} handleStockUpdate={handleStockUpdate} />
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex justify-center">
                                                <MoveToTrashStock stock={stock} handleStockUpdate={handleStockUpdate} />
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