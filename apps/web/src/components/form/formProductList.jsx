import { Typography } from "@material-tailwind/react"
import { ErrorMessage, Field } from "formik"
import { useEffect, useState } from "react";
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Axios } from "../../lib/api";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedProduct } from "../../redux/stockSlice";

export function FormProductList({ setFieldValue }) {
    const selectedProduct = useSelector((state) => state.stock.productValue);
    const adminToken = localStorage.getItem('adminToken');
    const [products, setProducts] = useState([]);
    const dispatch = useDispatch()
    
    const getProducts = async () => {
        const config = {
            headers: { Authorization: `Bearer ${adminToken}` }
        }
        try {
            const response = await Axios.get('products/', config)
            setProducts(response.data)
        } catch (error) {
            if (error.response.status == 400) {
                toast.error('Token Empty!');
            } else if (error.response.status == 401) {
                toast.error('Unauthorize (Super Admin only)!');
            } else {
                toast.error('Error getting products');
            }
        }
    }

    const handleProductChange = (selectedOption, setFieldValue) => {
        dispatch(setSelectedProduct(selectedOption))
        setFieldValue('ProductId', selectedOption.value)
    }

    useEffect(() => {
        getProducts();
    }, [])

    return (
        <div className="flex flex-col">
            <Typography variant="h6" color="blue-gray" className="mb-2">
                Product
            </Typography>
            <Field
                as={Select}
                name="ProductId"
                options={products.map((product) => ({ label: product.productName, value: product.id }))}
                value={selectedProduct}
                onChange={(e) => handleProductChange(e, setFieldValue)}
                isSearchable
                isClearable
            /> 
            <ErrorMessage
                component="FormControl"
                name="ProductId"
                style={{ color: "red"}}
            />
        </div>
    )
}