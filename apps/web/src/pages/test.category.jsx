import { Card, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaArrowDownShortWide, FaArrowDownUpAcrossLine, FaArrowUpShortWide } from "react-icons/fa6";
import { Axios } from "../lib/api";
import { FilterCategory } from "../components/dashboard/product/filterCategory";
import { Search } from "../components/dashboard/search";
import { PaginationButton } from "../components/paginationButton";

export function CategoryPage() {
    const adminToken = localStorage.getItem('adminToken');
    const [productList, setProductList] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    const tableHead = ["Name", "Weight", "Detail", "Price", "Total Stock", " ", ""];

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
        }
    }

    useEffect(() => {
        fetchProduct()
    }, [currentPage, sortBy, sortOrder, searchTerm, categoryFilter]);

    return (
        <Card className="h-full py-4 px-4 flex flex-col gap-4">
            <div className="w-full flex flex-col items-center justify-center gap-2 md:flex-row">
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} setCurrentPage={setCurrentPage} />
                <FilterCategory setCategoryFilter={setCategoryFilter} setCurrentPage={setCurrentPage} />
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
                                            className="font-normal"
                                        >
                                            {product.productWeight}
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