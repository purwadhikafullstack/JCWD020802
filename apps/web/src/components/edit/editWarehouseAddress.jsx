import { Card, Typography, CardBody } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import { FormAddressLabel } from "../form/formAddressLabel";
import { FormProvinceCity } from "../form/formProvinceCity";
import { FormAddress } from "../form/formAddress";
import { SubmitButton } from "../form/submitButton";
import { Axios } from "../../lib/api";
import { useSelector } from "react-redux";

const AddressSchema = Yup.object().shape({
    label: Yup.string().required('Label is required'),
    province: Yup.string().required('Province is required'),
    CityId: Yup.string().required('City is required'),
    address: Yup.string().required('Address is required')
});
 
export function EditWarehouseAddress({ handleClose, handleWarehouseUpdate }) {
    const [isLoading, setIsLoading] = useState(false);
    const position = useSelector((state) => state.position.value);
    const selectedAddress = useSelector((state) => state.position.addressValue);
    const adminToken = localStorage.getItem('adminToken');

    const handleSubmit = async (data) => {
        const config = {
            headers: { Authorization: `Bearer ${adminToken}` }
        }
        try {
            setIsLoading(true)
            await Axios.patch(`warehouses/edit/${selectedAddress.id}`, data, config)
            handleClose()
            handleWarehouseUpdate()
            toast.success('Warehouse address successfully changed!');
        } catch (error) {
            handleClose()
            toast.error('Failed to change warehouse address!');
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Card shadow={false} className="w-full mt-5">
                <Typography variant="h6" color="blue-gray" className="flex justify-center text-center">
                    Change warehouse detail address
                </Typography>
                <CardBody className="flex flex-col items-center justify-center">
                    <Formik
                        initialValues={{
                            label: selectedAddress.label,
                            province: '',
                            CityId: '',
                            address: selectedAddress.address,
                            latitude: position[0],
                            longtitude: position[1]
                        }}
                        validationSchema={AddressSchema}
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
                                    <SubmitButton isLoading={isLoading} buttonName={"Change"} />
                                </div>
                            </Form>
                        )}
                    </Formik>
                </CardBody>
            </Card>
        </>
    );
}