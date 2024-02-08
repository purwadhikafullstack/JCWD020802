import { useEffect, useState } from "react";
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Axios } from "../../../lib/api";

export function FilterProduct({ setProductFilter, setCurrentPage }) {
    const adminToken = localStorage.getItem('adminToken');
    const [products, setProducts] = useState([]);
    
    const getProducts = async () => {
        const config = {
            headers: { Authorization: `Bearer ${adminToken}` }
        }
        try {
            const response = await Axios.get('products/', config)
            setProducts(response.data)
        } catch (error) {
            if (error.response.status == 401) {
                toast.error('Token Empty!');
            } else {
                toast.error('Error getting products');
            }
        }
    }

    const handleProductChange = (value) => {
        setProductFilter(value?.label)
        setCurrentPage(1);
    }

    useEffect(() => {
        getProducts();
    }, [])

    return (
        <Select
            placeholder="Product"
            options={products.map((product) => ({ label: product.productName, value: product.id }))}
            onChange={handleProductChange}
            className="w-full"
            isSearchable
            isClearable
        />
    )
}