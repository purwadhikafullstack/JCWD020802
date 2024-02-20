import { useEffect, useState } from "react";
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Axios } from "../../../lib/api";

export function FilterWarehouseAdmin({ setWarehouseFilter, setCurrentPage }) {
    const adminToken = localStorage.getItem('adminToken');
    const [warehouses, setWarehouses] = useState([]);
    
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
            } {
                toast.error('Error getting warehouses');
            }
        }
    }

    const handleWarehouseChange = (value) => {
        setWarehouseFilter(value?.label)
        setCurrentPage(1);
    }

    useEffect(() => {
        getWarehouses();
    }, [])

    const warehouseOptions = warehouses.map((warehouse) => ({
        label: warehouse.label,
        value: warehouse.id,
    }));

    warehouseOptions.unshift({ label: "Not Assigned Yet", value: null });

    return (
        <Select
            placeholder="Warehouse"
            options={warehouseOptions}
            onChange={handleWarehouseChange}
            className="w-full"
            isSearchable
            isClearable
        />
    )
}