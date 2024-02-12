import { Card, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Axios } from "../../../lib/api";
import { FaArrowDownShortWide, FaArrowDownUpAcrossLine, FaArrowUpShortWide } from "react-icons/fa6";
import { PaginationButton } from "../../paginationButton";
import { FilterCategory } from "./filterCategory";
import { EditWarehouseAddressButton } from "../../edit/editWarehouseAddressButton";
import { MoveToTrashWarehouse } from "../warehouse/moveToTrashWarehouse";
import { Search } from "../search";
import { AddProductButton } from "./addProductButton";

export function ManageProduct() {
    const adminToken = localStorage.getItem('adminToken');
    const [productList, setProductList] = useState([])
    const [productUpdate, setProductUpdate] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    const tableHead = ["Name", "Weight (Kg)", "Detail", "Price (IDR)", "Total Stock", " ", ""];

    const handleProductUpdate = () => {
        setProductUpdate(true)
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

    const fetchProduct = async () => {
        const config = {
            headers: { Authorization: `Bearer ${adminToken}` },
            params: { page: currentPage, sortBy, sortOrder, searchTerm, category: categoryFilter }
        }
        try {
            const response = await Axios.get("products/list", config)
            setProductList(response.data.products)
            setTotalPages(response.data.totalPages);
            toast.success("Success getting product data!")
        } catch (error) {
            if (error.response.status == 400) {
                toast.error('Error Token')
            } else if (error.response.status == 401) {
                toast.error('Unauthorize (Super Admin only)!')
            } else {
                toast.error("Failed getting product data!")
            } 
        } finally {
            setProductUpdate(false)
        }
    }

    useEffect(() => {
        fetchProduct()
    }, [productUpdate, currentPage, sortBy, sortOrder, searchTerm, categoryFilter]);

    return (
        <Card className="h-full py-4 px-4 flex flex-col gap-4">
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} setCurrentPage={setCurrentPage} />
            <div className="w-full flex flex-col items-center justify-center gap-2 md:flex-row">
                <FilterCategory setCategoryFilter={setCategoryFilter} setCurrentPage={setCurrentPage} />
                <AddProductButton handleProductUpdate={handleProductUpdate} />
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
                        {productList.map((product) => {
                            const classes = "p-4 border-b border-green-600";
                            return (
                                <tr key={product.id}>
                                    <td className={classes}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {product.productName}
                                        </Typography>
                                    </td>
                                    <td className={`${classes} bg-green-50/50`}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal text-center"
                                        >
                                            {(product.productWeight)/1000}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="w-96 font-normal line-clamp-1"
                                        >
                                            {product.productDetail}
                                        </Typography>
                                    </td>
                                    <td className={`${classes} bg-green-50/50`}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {product.productPrice}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {product.totalStock}
                                        </Typography>
                                    </td>
                                    <td className={`${classes} bg-green-50/50`}>
                                        <div className="flex justify-center">
                                            <EditWarehouseAddressButton warehouse={product} handleProductUpdate={handleProductUpdate} />
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        <div className="flex justify-center">
                                            <MoveToTrashWarehouse warehouse={product} handleProductUpdate={handleProductUpdate} />
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
    )
}