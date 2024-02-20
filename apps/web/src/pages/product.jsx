import { Button, Card, CardBody, CardFooter, CardHeader, Navbar, Option, Select, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Axios } from "../lib/api";
import { FilterCategory } from "../components/dashboard/product/filterCategory";
import { Search } from "../components/dashboard/search";
import { PaginationButton } from "../components/paginationButton";
import { AddToCartButton } from "../components/cart/addToCartButton";
import { useParams } from "react-router-dom";
import { Footer } from "../components/footer";
import { NavBar } from "../components/navbar/navbar";
import { useDispatch, useSelector } from "react-redux";
import { setQuantity } from "../redux/cartSlice";
import { FaBox } from "react-icons/fa";

export function ProductPage() {
    const { category: categoryParam } = useParams();
    const [productList, setProductList] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState(categoryParam || '');

    const sortFieldOptions = [
        { label: "No Sort", value: null },
        { label: "Product Name", value: "productName" },
        { label: "Price", value: "productPrice" },
        { label: "Weight", value: "productWeight" },
        { label: "Stock", value: "totalStock" },
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

    const fetchProduct = async () => {   
        const config = {
            params: { page: currentPage, sortBy, sortOrder, searchTerm, category: categoryFilter }
        }
        try {
            const response = await Axios.get("products/all-user", config)
            setProductList(response.data.products)
            setTotalPages(response.data.totalPages);
        } catch (error) {
            if (error.response.status == 400) {
                toast.error('Please Log In to your account first!')
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
        <div className="flex flex-col justify-between h-screen">
            <div className="bg-gray-100">
                <NavBar />
                <div className="mx-auto h-full pt-2 px-0 lg:px-2 w-full bg-white md:w-4/5 lg:w-3/4">
                    <Card className="py-4 px-4 flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <FaBox className="h-5 w-5"/>
                            <Typography variant="h3">Products</Typography>
                        </div>
                        <div className="w-full flex flex-col items-center justify-center gap-2 md:flex-row">
                            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} setCurrentPage={setCurrentPage} />
                            <FilterCategory setCategoryFilter={setCategoryFilter} setCurrentPage={setCurrentPage} />
                        </div>
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
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:grid-cols-4">
                            {productList.map((product) => {
                                return (
                                    <div className="relative w-full">
                                        <Card key={product.id} className="max-w-full h-96">
                                            <CardHeader shadow={false} floated={false} className="h-44">
                                                <img
                                                    src={`${import.meta.env.VITE_LOCAL_HOST}${product.productMainPicture}`}
                                                    alt="card-image"
                                                    className="h-full mx-auto object-cover"
                                                />
                                            </CardHeader>
                                            <CardBody className="h-36">
                                                <div className="mb-2 flex flex-col gap-1">
                                                    <Typography variant="h6" color="blue-gray">
                                                        {product.productName}
                                                    </Typography>
                                                    <Typography
                                                        variant="small"
                                                        color="gray"
                                                        className="font-normal opacity-75 line-clamp-2"
                                                    >
                                                        {product.productDetail}
                                                    </Typography>
                                                    <Typography variant="h6" color="blue-gray" className="text-sm">
                                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(product.productPrice)}
                                                    </Typography>
                                                    <div className="flex justify-between">
                                                        <Typography variant="lead" color="blue-gray" className="text-sm">
                                                            Stock: {product.totalStock === null ? 0 : product.totalStock}
                                                        </Typography>
                                                        <Typography variant="lead" color="blue-gray" className="text-sm">
                                                            Weight: {product.productWeight / 1000} Kg
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </CardBody>
                                            <CardFooter className="py-2 h-fit">
                                                {
                                                    product.totalStock === null ?
                                                    <Button disabled className="h-10 px-0 w-full">NO STOCK</Button> :
                                                    <AddToCartButton product={product} />
                                                }
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
            </div>
            <Footer />
        </div>
    )
}