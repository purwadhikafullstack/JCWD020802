import { Card, Button, Typography, CardBody, Dialog } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Axios } from "../../../lib/api";
import { toast } from 'react-toastify';
import { RegisterGoogle } from "./registerGoogleEmail";
import { FormEmail } from "../../form/formEmail";
import { SubmitButton } from "../../form/submitButton";
import { useNavigate } from "react-router-dom";

const SendEmailSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address format")
        .required("Email is required")
})
 
export function RegisterEmail() {
    const [openRegister, setOpenRegister] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()

    const handleOpenRegister = () => setOpenRegister((cur) => !cur);

    const handleSubmit = async (data) => {
        try {
            setIsLoading(true)
            await Axios.post("users/register-email", data);
            handleOpenRegister()
            toast.success('Email has been sent. Please check your email to verify and continue the registration process.');
            navigate('/')
            window.location.reload();
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
        <div className="w-full lg:w-24">
            <Button
                size="sm"
                color="green"
                className="w-full bg-green-600 hover:bg-green-300"
                onClick={handleOpenRegister}
            >
                <span>Register</span>
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
                            Register
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal text-center">
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
                            <Form className="mt-8 w-full">
                                <div className="flex flex-col gap-6">
                                    <FormEmail />
                                    <SubmitButton isLoading={isLoading} buttonName={"Send"} />
                                </div>
                                <div class="relative flex py-5 items-center">
                                    <div class="flex-grow border-t border-gray-400"></div>
                                    <span class="flex-shrink mx-4">OR</span>
                                    <div class="flex-grow border-t border-gray-400"></div>
                                </div>
                                <RegisterGoogle handleOpenRegister={handleOpenRegister} />  
                            </Form>
                        </Formik>
                    </CardBody>
                </Card>
            </Dialog>
        </div>
    );
}