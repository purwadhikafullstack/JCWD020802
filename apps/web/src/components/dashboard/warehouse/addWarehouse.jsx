import { Card, Typography, CardBody } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Axios } from "../../../lib/api";
import { toast } from 'react-toastify';
import { FormAddressLabel } from "../../form/formAddressLabel";
import { FormProvinceCity } from "../../form/formProvinceCity";
import { FormAddress } from "../../form/formAddress";
import { SubmitButton } from "../../form/submitButton";
import { useSelector } from "react-redux";

const WarehouseSchema = Yup.object().shape({
    label: Yup.string().required('Label is required'),
    province: Yup.string().required('Province is required'),
    CityId: Yup.string().required('City is required'),
    address: Yup.string().required('Address is required'),
    note: Yup.string()
});
 
export function AddWarehouse({ handleClose, handleWarehouseUpdate }) {
    const [isLoading, setIsLoading] = useState(false);
    const position = useSelector((state) => state.position.value);
    const adminToken = localStorage.getItem('adminToken');

    const handleSubmit = async (data) => {
        const config = {
            headers: { Authorization: `Bearer ${adminToken}` }
        }
        try {
            setIsLoading(true)
            await Axios.post("warehouses/add", data, config)
            handleClose()
            handleWarehouseUpdate()
            toast.success('Warehouse Successfully Added!');
        } catch (error) {
            handleClose()
            toast.error('Failed to Add Warehouse!');
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Card shadow={false} className="w-full">
                <Typography variant="h6" color="blue-gray" className="flex justify-center text-center">
                    Fill warehouse detail address
                </Typography>
                <CardBody className="flex flex-col items-center justify-center">
                    <Formik
                        initialValues={{
                            label: '',
                            province: '',
                            CityId: '',
                            address: '',
                            latitude: position[0],
                            longtitude: position[1],
                        }}
                        validationSchema={WarehouseSchema}
                        onSubmit={(values, action) => {
                            handleSubmit(values),
                            action.resetForm()
                        }}
                    >
                        {({setFieldValue}) => (
                            <Form className="w-full">
                                <div className="flex flex-col gap-5">
                                    <FormAddressLabel />
                                    <FormProvinceCity setFieldValue={setFieldValue}/>
                                    <FormAddress />
                                    <SubmitButton isLoading={isLoading} buttonName={"Add Warehouse"} />
                                </div>
                            </Form>
                        )}
                    </Formik>
                </CardBody>
            </Card>
        </>
    );
}