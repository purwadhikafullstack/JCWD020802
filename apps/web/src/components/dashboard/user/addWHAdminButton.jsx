import { Card, Button, Typography, CardBody, Dialog } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import { Axios } from "../../../lib/api";
import { FormEmail } from "../../form/formEmail";
import { SubmitButton } from "../../form/submitButton";
import { FaPlus } from "react-icons/fa";

const SendEmailSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address format")
        .required("Email is required")
})
 
export function AddWHAdminButton() {
    const adminToken = localStorage.getItem('adminToken');
    const [openRegister, setOpenRegister] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenRegister = () => setOpenRegister((cur) => !cur);

    const handleSubmit = async (data) => {
        const config = {
            headers: { Authorization: `Bearer ${adminToken}` }
        }
        try {
            setIsLoading(true)
            await Axios.post("admins/register-email", data, config);
            handleOpenRegister()
            toast.success('Email has been sent. Please check the email to verify and continue the registration process.');
        } catch (error) {
            handleOpenRegister()
            if (error.response.status == 401) {
                toast.error('Email is already exist!');
            } else {
                toast.error('Failed to register. Please try again.')
            }
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className="w-full">
            <Button onClick={handleOpenRegister} className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-300">
                <FaPlus />
                <Typography variant="h6" className="text-xs">Warehouse Admin</Typography>
            </Button>
            <Dialog
                size="xs"
                open={openRegister}
                handler={handleOpenRegister}
                className="bg-transparent shadow-none"
            >
                <Card shadow={false} className="mx-auto w-full">
                    <CardBody className="flex flex-col items-center justify-center">
                        <Typography variant="h4" color="blue-gray">
                            Add Admin
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal text-center">
                            Nice to meet you! Please enter admin email to register.
                        </Typography>
                        <Formik
                            initialValues={{ email: '' }}
                            validationSchema={SendEmailSchema}
                            onSubmit={(values, action) => {
                                handleSubmit(values)
                                action.resetForm()
                            }}
                        >
                            <Form className="mt-8 w-full">
                                <div className="flex flex-col gap-6">
                                    <FormEmail />
                                    <SubmitButton isLoading={isLoading} buttonName={"Send"} />
                                </div>  
                            </Form>
                        </Formik>
                    </CardBody>
                </Card>
            </Dialog>
        </div>
    );
}