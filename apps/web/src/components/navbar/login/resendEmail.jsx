import { Card, Typography, CardBody, Dialog, Button, IconButton } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Axios } from "../../../lib/api";
import { toast } from 'react-toastify';
import { FormEmail } from "../../form/formEmail";
import { SubmitButton } from "../../form/submitButton";
import { IoSend } from "react-icons/io5";

const SendEmailSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address format")
        .required("Email is required")
})
 
export function ResendEmail({ handleOpenLogin }) {
    const [openEmail, setOpenEmail] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenEmail = () => {
        setOpenEmail((cur) => !cur);
    }

    const handleSubmit = async (data) => {
        try {
            setIsLoading(true)
            await Axios.post("users/resend-email-verification", data);
            handleOpenEmail()
            handleOpenLogin()
            toast.success('Email has been sent. Please check your email to verify!');
        } catch (error) {
            handleOpenEmail()
            handleOpenLogin()
            if (error.response.status == 400) {
                toast.error('Email is already verified!');
            } else if (error.response.status == 401) {
                toast.error('Email is not registered!');
            } else {
                toast.error('Failed to register. Please try again.')
            }
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className="w-fit">
            <IconButton variant="text" size="sm" color="green" onClick={handleOpenEmail}>
                <IoSend fontSize={"15px"}/>
            </IconButton>
            <Dialog
                size="xs"
                open={openEmail}
                handler={handleOpenEmail}
                className="bg-transparent shadow-none"
            >
                <Card shadow={false} className="mx-auto w-full">
                    <CardBody className="flex flex-col items-center justify-center">
                        <Typography variant="h4" color="blue-gray" className="text-center">
                            Resend Email Verification
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal text-center">
                            Please enter your email to resend email verification.
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
                                <div className="mb-1 flex flex-col gap-6">
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