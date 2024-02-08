import { Card, Typography, CardBody, Dialog } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Axios } from "../../lib/api";
import { useSelector } from "react-redux";
import { EditButton } from "./editButton";
import { toast } from 'react-toastify';
import { FormEmail } from "../form/formEmail";
import { SubmitButton } from "../form/submitButton";

const EditEmailSchema = Yup.object().shape({ email: Yup.string().email("Invalid email address format") })
 
export function EditEmail({ onUserUpdate }) {
    const user = useSelector((state) => state.user.value)
    const token = localStorage.getItem("token");
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
 
    const handleOpen = () => setOpen(!open);

    const handleSubmit = async (data) => {
        try {
            setIsLoading(true)
            await Axios.patch(
                "edits/email",
                data,
                { headers: { Authorization: `Bearer ${token}` }}
            )
            handleOpen()
            toast.success('Email successfully changed. Please check your email to verify your new email!');
            onUserUpdate()
        } catch (error) {
            console.log(error);
            toast.error('Failed change your email');
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <EditButton tooltip={"Edit Email"} handleOpen={handleOpen}/>
            <Dialog size="xs" open={open} handler={handleOpen}>
                <Card shadow={false} className="mx-auto w-full">
                    <CardBody className="flex flex-col items-center justify-center">
                        <Typography variant="h4" color="blue-gray">
                            Edit Email
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            Change your email account
                        </Typography>
                        <Formik
                            initialValues={{ email: user.email }}
                            validationSchema={EditEmailSchema}
                            onSubmit={(values, action) => {
                                handleSubmit(values)
                                action.resetForm()
                            }}
                        >
                            <Form className="mt-8 w-full max-w-screen-lg sm:w-96">
                                <div className="flex flex-col gap-5">
                                    <FormEmail />
                                    <SubmitButton isLoading={isLoading} buttonName={"Change"} />
                                </div>
                            </Form>
                        </Formik>
                    </CardBody>
                </Card>
            </Dialog>
        </>
    );
}