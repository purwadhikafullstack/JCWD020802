import { Card, Typography, CardBody } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import { FormAddressLabel } from "../form/formAddressLabel";
import { FormProvinceCity } from "../form/formProvinceCity";
import { FormAddress } from "../form/formAddress";
import { FormAddressNote } from "../form/formAddressNote";
import { SubmitButton } from "../form/submitButton";
import { Axios } from "../../lib/api";
import { useSelector } from "react-redux";

const AddressSchema = Yup.object().shape({
    label: Yup.string().required('Label is required'),
    province: Yup.string().required('Province is required'),
    CityId: Yup.string().required('City is required'),
    address: Yup.string().required('Address is required'),
    note: Yup.string()
});
 
export function ChangeAddress({ handleClose, handleAddressUpdate }) {
    const [isLoading, setIsLoading] = useState(false);
    const position = useSelector((state) => state.position.value);
    const selectedAddress = useSelector((state) => state.position.addressValue);

    const handleSubmit = async (data) => {
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        }
        try {
            setIsLoading(true)
            await Axios.patch(`addresses/change-address/${selectedAddress.id}`, data, config)
            handleClose()
            handleAddressUpdate()
            toast.success('Address Successfully Changed!');
        } catch (error) {
            handleClose()
            toast.error('Failed to change address!');
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Card shadow={false} className="w-full mt-5">
                <Typography variant="h6" color="blue-gray" className="flex justify-center text-center">
                    Change your detail address
                </Typography>
                <CardBody className="flex flex-col items-center justify-center">
                    <Formik
                        initialValues={{
                            label: selectedAddress.label,
                            province: '',
                            CityId: '',
                            address: selectedAddress.address,
                            latitude: position[0],
                            longtitude: position[1],
                            note: selectedAddress.note
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
                                    <FormAddressNote />
                                    <SubmitButton isLoading={isLoading} buttonName={"Change Address"} />
                                </div>
                            </Form>
                        )}
                    </Formik>
                </CardBody>
            </Card>
        </>
    );
}