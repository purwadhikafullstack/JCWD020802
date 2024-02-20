import { useEffect, useState } from "react";
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { Axios } from "../../lib/api";
import { setSelectedCity, setSelectedProvince } from "../../redux/positionSlice";

export function FilterProvinceCity({ setProvinceFilter, setCityFilter, setCurrentPage }) {
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const dispatch = useDispatch()
    
    const getProvinces = async () => {
        try {
            const response = await Axios.get('addresses/province')
            setProvinces(response.data)
        } catch (error) {
            console.log(error);
            toast.error('Error getting provinces');
        }
    }

    const getCities = async () => {
        try {
            const response = await Axios.get('addresses/city')
            setCities(response.data)
        } catch (error) {
            console.log(error);
            toast.error('Error getting cities');
        }
    }

    const handleCityChange = async (selectedOption) => {
        try {
            dispatch(setSelectedCity(selectedOption))
            if (selectedOption == null) {
                getCities()
                getProvinces()
                dispatch(setSelectedProvince(null))
            } else {
                const response = await Axios.get(`addresses/province/${selectedOption.value}`)
                setProvinces(response.data)
                dispatch(setSelectedProvince({ label: response.data[0].province, value: response.data[0].id }))
            }
            setCityFilter(selectedOption?.label)
            setCurrentPage(1);
        } catch (error) {
            console.log(error);
            toast.error('Error getting cities');
        }
    }

    const handleProvinceChange = async (selectedOption) => {
        try {
            dispatch(setSelectedProvince(selectedOption))
            if (selectedOption == null) {
                getCities()
                getProvinces()
                dispatch(setSelectedCity(null))
            } else {
                const response = await Axios.get(`addresses/city/${selectedOption.value}`)
                setCities(response.data)
            }
            setProvinceFilter(selectedOption?.label)
            setCurrentPage(1);
        } catch (error) {
            console.log(error);
            toast.error('Error getting provinces');
        }
    }

    useEffect(() => {
        getProvinces();
        getCities();
    }, [])

    return (
        <div className="w-full flex gap-2">
            <Select
                placeholder="Province"
                options={provinces.map((province) => ({ label: province.province, value: province.id }))}
                onChange={handleProvinceChange}
                className="w-full"
                isSearchable
                isClearable
            />
            <Select
                placeholder="City"
                options={cities.map((city) => ({ label: `${city.type} ${city.city_name}`, value: city.id }))}
                onChange={handleCityChange}
                className="w-full"
                isSearchable
                isClearable
            />
        </div>
    )
}