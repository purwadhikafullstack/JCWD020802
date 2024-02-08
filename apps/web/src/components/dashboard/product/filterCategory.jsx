import { useEffect, useState } from "react";
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Axios } from "../../../lib/api";

export function FilterCategory({ setCategoryFilter, setCurrentPage }) {
    const [categories, setCategories] = useState([]);
    
    const getCategories = async () => {
        try {
            const response = await Axios.get('categories/')
            setCategories(response.data)
        } catch (error) {
            toast.error('Error getting categories');
        }
    }

    const handleCategoryChange = (value) => {
        setCategoryFilter(value?.label)
        setCurrentPage(1);
    }

    useEffect(() => {
        getCategories();
    }, [])

    return (
        <Select
            placeholder="Category"
            options={categories.map((category) => ({ label: category.categoryName, value: category.id }))}
            onChange={handleCategoryChange}
            className="w-full"
            isSearchable
            isClearable
        />
    )
}