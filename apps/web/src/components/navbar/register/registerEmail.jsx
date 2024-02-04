import { Card, Input, Button, Typography, CardBody, Dialog, DialogHeader, DialogFooter, DialogBody, } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Axios } from "../../../lib/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";
import { RegisterGoogle } from "./registerGoogleEmail";

const SendEmailSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address format")
        .required("Email is required")
})
 
export function RegisterEmail() {
    const [openRegister, setOpenRegister] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenRegister = () => setOpenRegister((cur) => !cur);

    const handleSubmit = async (data) => {
        try {
            setIsLoading(true)
            await Axios.post("users/register-email", data);
            handleOpenRegister()
            toast.success('Email has been sent. Please check your email to verify and continue the registration process.');
        } catch (error) {
            console.error(error);
            toast.error('Email is already exist!');
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className="w-full lg:w-24">
            <ToastContainer />
            <Button
                variant="gradient"
                size="sm"
                color="brown"
                className="w-full"
                onClick={handleOpenRegister}
            >
                <span>Register</span>
            </Button>
            <Dialog
                size="sm"
                open={openRegister}
                handler={handleOpenRegister}
                className="bg-transparent shadow-none"
            >
                <Card shadow={false} className="mx-auto w-full">
                    <CardBody className="flex flex-col items-center justify-center">
                        <Typography variant="h4" color="blue-gray">
                            Register
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            Nice to meet you! Please enter your email to register.
                        </Typography>
                        <Formik
                            initialValues={{ email: '' }}
                            validationSchema={SendEmailSchema}
                            onSubmit={(values, action) => {
                                handleSubmit(values)
                                action.resetForm()
                            }}
                        >
                            <Form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                                <div className="mb-1 flex flex-col gap-6">
                                    <div className="mb-1 flex flex-col">
                                        <Typography variant="h6" color="blue-gray" className="mb-2">
                                            Email
                                        </Typography>
                                        <Field
                                            as={Input}
                                            name="email"
                                            type="email"
                                            placeholder="name@mail.com"
                                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                            labelProps={{
                                                className: "before:content-none after:content-none",
                                            }}
                                        />
                                        <ErrorMessage
                                            component="FormControl"
                                            name="email"
                                            style={{ color: "red"}}
                                        />
                                    </div>
                                    <Button
                                        type='submit'
                                        color="brown"
                                        size="lg"
                                        ripple="light"
                                        className="mt-2" 
                                        fullWidth
                                        disabled={isLoading}
                                    >
                                        {
                                            isLoading ?
                                            <ClipLoader size={20} color={"#fff"} loading={isLoading} /> :
                                            "Send"
                                        }
                                    </Button>
                                </div>
                                <RegisterGoogle />  
                            </Form>
                        </Formik>
                    </CardBody>
                </Card>
            </Dialog>
        </div>
    );
}