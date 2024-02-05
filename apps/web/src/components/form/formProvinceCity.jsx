import { Typography } from "@material-tailwind/react"
import { ErrorMessage, Field } from "formik"
import { useEffect, useState } from "react";
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Axios } from "../../lib/api";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCity, setSelectedProvince } from "../../redux/positionSlice";

export function FormProvinceCity({ setFieldValue }) {
    const selectedProvince = useSelector((state) => state.position.provinceValue);
    const selectedCity = useSelector((state) => state.position.cityValue);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const dispatch = useDispatch()
    
    const getProvinces = async () => {
        try {
            const response = await Axios.get('addresses/province')
            setProvinces(response.data)
        } catch (error) {
            toast.error('Error getting provinces');
        }
    }

    const getCities = async () => {
        try {
            const response = await Axios.get('addresses/city')
            setCities(response.data)
        } catch (error) {
            toast.error('Error getting cities');
        }
    }

    const handleCityChange = async (selectedOption, setFieldValue) => {
        try {
            dispatch(setSelectedCity(selectedOption))
            setFieldValue('CityId', selectedOption.value)
            if (selectedOption == null) {
                getCities()
                getProvinces()
                dispatch(setSelectedProvince(null))
            } else {
                const response = await Axios.get(`addresses/province/${selectedOption.value}`)
                setProvinces(response.data)
                dispatch(setSelectedProvince({ label: response.data[0].province, value: response.data[0].id }))
            }
        } catch (error) {
            toast.error('Error getting cities');
        }
    }

    const handleProvinceChange = async (selectedOption, setFieldValue) => {
        try {
            dispatch(setSelectedProvince(selectedOption))
            setFieldValue('province', selectedOption.value)
            if (selectedOption == null) {
                getCities()
                getProvinces()
                dispatch(setSelectedCity(null))
            } else {
                const response = await Axios.get(`addresses/city/${selectedOption.value}`)
                setCities(response.data)
            }
        } catch (error) {
            toast.error('Error getting provinces');
        }
    }

    useEffect(() => {
        getProvinces();
        getCities();
    }, [])

    return (
        <>
            <div className="flex flex-col">
                <Typography variant="h6" color="blue-gray" className="mb-2">
                    Province
                </Typography>
                <Field
                    as={Select}
                    name="province"
                    options={provinces.map((province) => ({ label: province.province, value: province.id }))}
                    value={selectedProvince}
                    onChange={(e) => handleProvinceChange(e, setFieldValue)}
                    isSearchable
                    isClearable
                /> 
                <ErrorMessage
                    component="FormControl"
                    name="province"
                    style={{ color: "red"}}
                />
            </div>
            <div className="flex flex-col">
                <Typography variant="h6" color="blue-gray" className="mb-2">
                    City
                </Typography>
                <Field
                    as={Select}
                    name="CityId"
                    options={cities.map((city) => ({ label: `${city.type} ${city.city_name}`, value: city.id }))}
                    value={selectedCity}
                    onChange={(e) => handleCityChange(e, setFieldValue)}
                    isSearchable
                    isClearable
                /> 
                <ErrorMessage
                    component="FormControl"
                    name="CityId"
                    style={{ color: "red"}}
                />
            </div>
        </>
    )
}