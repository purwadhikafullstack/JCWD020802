import { Typography } from "@material-tailwind/react"
import { ErrorMessage, Field } from "formik"
import { useEffect, useState } from "react";
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Axios } from "../../lib/api";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedWarehouse } from "../../redux/stockSlice";

export function FormWarehouseList({ setFieldValue }) {
    const selectedWarehouse = useSelector((state) => state.stock.warehouseValue);
    const adminToken = localStorage.getItem('adminToken');
    const [warehouses, setWarehouses] = useState([]);
    const dispatch = useDispatch()
    
    const getWarehouses = async () => {
        const config = {
            headers: { Authorization: `Bearer ${adminToken}` }
        }
        try {
            const response = await Axios.get('warehouses', config)
            setWarehouses(response.data)
        } catch (error) {
            if (error.response.status == 400) {
                toast.error('Token Empty!');
            } else if (error.response.status == 401) {
                toast.error('Unauthorize (Super Admin only)!');
            } else {
                toast.error('Error getting warehouses');
            }
        }
    }

    const handleWarehouseChange = (selectedOption, setFieldValue) => {
        dispatch(setSelectedWarehouse(selectedOption))
        setFieldValue('WarehouseId', selectedOption.value)
    }

    useEffect(() => {
        getWarehouses();
    }, [])

    return (
        <div className="flex flex-col">
            <Typography variant="h6" color="blue-gray" className="mb-2">
                Warehouse
            </Typography>
            <Field
                as={Select}
                name="WarehouseId"
                options={warehouses.map((warehouse) => ({ label: warehouse.label, value: warehouse.id }))}
                value={selectedWarehouse}
                onChange={(e) => handleWarehouseChange(e, setFieldValue)}
                isSearchable
                isClearable
            /> 
            <ErrorMessage
                component="FormControl"
                name="WarehouseId"
                style={{ color: "red"}}
            />
        </div>
    )
}