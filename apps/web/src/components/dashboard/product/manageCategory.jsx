import { Card, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Axios } from "../../../lib/api";
import { FaArrowDownShortWide, FaArrowDownUpAcrossLine, FaArrowUpShortWide } from "react-icons/fa6";
import { PaginationButton } from "../../paginationButton";
import { FilterCategory } from "./filterCategory";
import { AddCategoryButton } from "./addCategoryButton";
import { EditWarehouseAddressButton } from "../../edit/editWarehouseAddressButton";
import { MoveToTrashWarehouse } from "../warehouse/moveToTrashWarehouse";

export function ManageCategory() {
    const adminToken = localStorage.getItem('adminToken');
    const [categoryList, setCategoryList] = useState([])
    const [categoryUpdate, setCategoryUpdate] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('');

    const tableHead = ["Category Name", " ", ""];

    const handleCategoryUpdate = () => {
        setCategoryUpdate(true)
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

    const fetchCategory = async () => {
        const config = {
            headers: { Authorization: `Bearer ${adminToken}` },
            params: { page: currentPage, sortBy, sortOrder, category: categoryFilter }
        }
        try {
            const response = await Axios.get("categories/list", config)
            setCategoryList(response.data.categories)
            setTotalPages(response.data.totalPages);
            toast.success("Success getting category data!")
        } catch (error) {
            if (error.response.status == 400) {
                toast.error('Error Token')
            } else if (error.response.status == 401) {
                toast.error('Unauthorize (Super Admin only)!')
            } else {
                toast.error("Failed getting category data!")
            } 
        } finally {
            setCategoryUpdate(false)
        }
    }

    useEffect(() => {
        fetchCategory()
    }, [categoryUpdate, currentPage, sortBy, sortOrder, categoryFilter]);

    return (
        <Card className="h-full py-4 px-4 flex flex-col gap-4">
            <div className="w-full flex flex-col items-center justify-center gap-2 md:flex-row">
                <FilterCategory setCategoryFilter={setCategoryFilter} setCurrentPage={setCurrentPage} />
                <AddCategoryButton handleCategoryUpdate={handleCategoryUpdate} />
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
                        {categoryList.map((category) => {
                            const classes = "p-4 border-b border-green-600";
                            return (
                                <tr key={category.id}>
                                    <td className={classes}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {category.categoryName}
                                        </Typography>
                                    </td>
                                    <td className={`${classes} bg-green-50/50`}>
                                        <div className="flex justify-center">
                                            <EditWarehouseAddressButton warehouse={category} handleCategoryUpdate={handleCategoryUpdate} />
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        <div className="flex justify-center">
                                            <MoveToTrashWarehouse warehouse={category} handleCategoryUpdate={handleCategoryUpdate} />
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