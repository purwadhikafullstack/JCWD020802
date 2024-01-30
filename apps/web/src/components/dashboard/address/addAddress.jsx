import { Card, Input, Button, Typography, CardBody, Textarea } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Axios } from "../../../lib/api";
import { toast } from 'react-toastify';
import { ClipLoader } from "react-spinners";
import { FormAddressLabel } from "../../form/formAddressLabel";
import { FormProvinceCity } from "../../form/formProvinceCity";

const AddressSchema = Yup.object().shape({
    label: Yup.string().required('Label is required'),
    province: Yup.string().required('Province is required'),
    CityId: Yup.string().required('City is required'),
    address: Yup.string().required('Address is required'),
    note: Yup.string()
});
 
export function AddAddress({ pinLatitude, pinLongtitude, isMobile, handleOpen }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data) => {
        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        }
        try {
            setIsLoading(true)
            await Axios.post("addresses/add", data, config)
            toast.success('Address Successfully Added!', {
                onClose: () => {
                    setTimeout(() => { handleOpen() }, 5000);
                }
            });
        } catch (error) {
            toast.error('Failed to Add Address!');
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Card shadow={false} className="w-full mt-5">
                <Typography variant={isMobile ? "h6" : "h5"} color="blue-gray" className="flex justify-center text-center">
                    Fill your detail address
                </Typography>
                <CardBody className="flex flex-col items-center justify-center">
                    <Formik
                        initialValues={{
                            label: '',
                            province: '',
                            CityId: '',
                            address: '',
                            latitude: pinLatitude,
                            longtitude: pinLongtitude,
                            note: ''
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
                                    <div className="flex flex-col">
                                        <Typography variant="h6" color="blue-gray" className="mb-1">
                                            Full Address
                                        </Typography>
                                        <Field
                                            as={Textarea}
                                            name="address"
                                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                            labelProps={{ className: "before:content-none after:content-none" }}
                                        />
                                        <ErrorMessage
                                            component="FormControl"
                                            name="address"
                                            style={{ color: "red"}}
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <Typography variant="h6" color="blue-gray" className="mb-1">
                                            Note (optional)
                                        </Typography>
                                        <Field
                                            as={Input}
                                            name="note"
                                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                            labelProps={{ className: "before:content-none after:content-none" }}
                                        />
                                        <ErrorMessage
                                            component="FormControl"
                                            name="note"
                                            style={{ color: "red"}}
                                        />
                                    </div>
                                    <Button
                                        type='submit'
                                        size="lg"
                                        className="mt-2" 
                                        fullWidth
                                        color="green"
                                        disabled={isLoading}
                                    >
                                        {
                                            isLoading ? 
                                            <ClipLoader size={20} color={"#fff"} loading={isLoading} /> : 
                                            "Save"
                                        }
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </CardBody>
            </Card>
        </>
    );
}