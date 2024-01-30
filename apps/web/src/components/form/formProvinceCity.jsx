import { Typography } from "@material-tailwind/react"
import { ErrorMessage, Field } from "formik"
import { useEffect, useState } from "react";
import Select from 'react-select';
import { toast } from 'react-toastify';
import { Axios } from "../../lib/api";

export function FormProvinceCity({ setFieldValue }) {
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    
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
            setSelectedCity(selectedOption)
            setFieldValue('CityId', selectedOption.value)
            if (selectedOption == null) {
                getCities()
                getProvinces()
                setSelectedProvince(null)
            } else {
                const response = await Axios.get(`addresses/province/${selectedOption.value}`)
                setProvinces(response.data)
                setSelectedProvince({ label: response.data[0].province, value: response.data[0].id })
            }
        } catch (error) {
            toast.error('Error getting cities');
        }
    }

    const handleProvinceChange = async (selectedOption, setFieldValue) => {
        try {
            setSelectedProvince(selectedOption)
            setFieldValue('province', selectedOption.value)
            if (selectedOption == null) {
                getCities()
                getProvinces()
                setSelectedCity(null)
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
                    value={selectedProvince?.value}
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
                    value={selectedCity?.value}
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