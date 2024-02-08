import { Button, Card, CardBody, CardFooter, CardHeader, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaArrowDownShortWide, FaArrowDownUpAcrossLine, FaArrowUpShortWide } from "react-icons/fa6";
import { Axios } from "../lib/api";
import { FilterCategory } from "../components/dashboard/product/filterCategory";
import { Search } from "../components/dashboard/search";
import { PaginationButton } from "../components/paginationButton";
import { AddToCartButton } from "../components/cart/addToCartButton";

export function ProductPage() {
    const adminToken = localStorage.getItem('adminToken');
    const [productList, setProductList] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

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
            const response = await Axios.get("products/all-user", config)
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
        <div className="px-5 py-5 sm:px-20 2xl:px-80">
            <Card className="h-full py-4 px-4 flex flex-col gap-4">
                <div className="w-full flex flex-col items-center justify-center gap-2 md:flex-row">
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} setCurrentPage={setCurrentPage} />
                    <FilterCategory setCategoryFilter={setCategoryFilter} setCurrentPage={setCurrentPage} />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:grid-cols-5">
                    {productList.map((product) => {
                        return (
                            <div className="relative w-full">
                                <Card key={product.id} className="max-w-full h-80">
                                    <CardHeader shadow={false} floated={false} className="h-40">
                                        <img
                                            src="https://images.unsplash.com/photo-1629367494173-c78a56567877?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=927&q=80"
                                            alt="card-image"
                                            className="h-full w-full object-cover"
                                        />
                                    </CardHeader>
                                    <CardBody className="h-28">
                                        <div className="mb-2 flex flex-col">
                                            <Typography variant="h6" color="blue-gray">
                                                {product.productName}
                                            </Typography>
                                            <Typography color="blue-gray" className="text-sm">
                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(product.productPrice)}
                                            </Typography>
                                            <Typography
                                                variant="small"
                                                color="gray"
                                                className="font-normal opacity-75 line-clamp-2"
                                            >
                                                {product.productDetail}
                                            </Typography>
                                        </div>
                                    </CardBody>
                                    <CardFooter className="py-2 h-fit">
                                        <AddToCartButton product={product} />
                                    </CardFooter>
                                </Card>
                            </div>
                        )
                    })}
                </div>
                <div className="flex items-center justify-center">
                    <PaginationButton currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
                </div>
            </Card>
        </div>
    )
}