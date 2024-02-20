import { Button, Option, Select, Typography } from "@material-tailwind/react";
import { Axios } from "../../lib/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaginationButton } from "../paginationButton";
import { toast } from "react-toastify";
import { FilterCategory } from "../dashboard/product/filterCategory";

export function ProductCategories() {
    const [categoryLists, setCategoryLists] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOrder, setSortOrder] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('');
    const sortBy = 'categoryName'
    const navigate = useNavigate()

    const sortOrderOptions = [
        { label: "No Order", value: null },
        { label: "Ascending", value: "asc" },
        { label: "Descending", value: "desc" },
    ];

    const handleOrder = (value) => {
        setSortOrder(value);
        setCurrentPage(1);
    }

    const getCategories = async () => {
        const config = {
            params: { page: currentPage, sortBy, sortOrder, category: categoryFilter }
        }
        try {
            const response = await Axios.get('categories/home', config)
            setCategoryLists(response.data.categories)
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.log(error);
             if (error.response.status == 400) {
                toast.error('Error Token')
            } else if (error.response.status == 401) {
                toast.error('Unauthorize (Super Admin only)!')
            } else {
                toast.error("Failed getting category data!")
            }
        }
    }
    
    useEffect(() => {
        getCategories()
    }, [currentPage, sortBy, sortOrder, categoryFilter])

    return (
        <div className="flex flex-col gap-3">
            <div className="mt-5 flex flex-col md:flex-row justify-between">
                <Typography variant="h3">Categories</Typography>
                <div className="md:ml-28 w-full flex items-center gap-2">
                    <FilterCategory setCategoryFilter={setCategoryFilter} setCurrentPage={setCurrentPage} />
                    <Select label="Order By" color="green" onChange={handleOrder}>
                        {sortOrderOptions.map((option) => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categoryLists.map((item) => (
                    <div className="relative w-full">
                        <Button className="bg-white py-1 px-0 border-2 border-brown-400" onClick={() => navigate(`/products/${item.categoryName}`)}>
                            <img class="h-auto max-w-full rounded-lg" src={`${import.meta.env.VITE_LOCAL_HOST}${item.categoryPicture}`} alt="" />
                            <figcaption className="absolute bottom-3 w-4/5 md:w-3/4 justify-between rounded-r-xl border border-white bg-gray-300 py-2 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
                                <Typography variant="lead" color="blue-gray" className="font-bold text-sm lg:text-lg">
                                    {item.categoryName}
                                </Typography>
                            </figcaption>
                        </Button>
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-center">
                <PaginationButton currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
            </div>
        </div>
    )
}