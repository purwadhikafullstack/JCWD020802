import { Typography } from "@material-tailwind/react"
import { ErrorMessage, Field } from "formik"
import { useEffect, useState } from "react";
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Axios } from "../../lib/api";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCategory } from "../../redux/productSlice";

export function FormCategoryList({ setFieldValue }) {
    const selectedCategory = useSelector((state) => state.position.categoryValue);
    const adminToken = localStorage.getItem('adminToken');
    const [categories, setCategories] = useState([]);
    const dispatch = useDispatch()
    
    const getCategories = async () => {
        const config = {
            headers: { Authorization: `Bearer ${adminToken}` }
        }
        try {
            const response = await Axios.get('categories/', config)
            setCategories(response.data)
        } catch (error) {
            if (error.response.status == 404) {
                toast.error('Token Empty!');
            } else {
                toast.error('Error getting categories');
            }
        }
    }

    const handleCategoryChange = (selectedOption, setFieldValue) => {
        dispatch(setSelectedCategory(selectedOption))
        setFieldValue('ProductCategoryId', selectedOption.value)
    }

    useEffect(() => {
        getCategories();
    }, [])

    return (
        <div className="flex flex-col">
            <Typography variant="h6" color="blue-gray" className="mb-2">
                Category
            </Typography>
            <Field
                as={Select}
                name="ProductCategoryId"
                options={categories.map((category) => ({ label: category.categoryName, value: category.id }))}
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e, setFieldValue)}
                isSearchable
                isClearable
            /> 
            <ErrorMessage
                component="FormControl"
                name="ProductCategoryId"
                style={{ color: "red"}}
            />
        </div>
    )
}