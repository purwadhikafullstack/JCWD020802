import { Card, Typography, CardBody, Dialog } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form } from "formik";
import { Axios } from "../../lib/api"; 
import { EditButton } from "./editButton";
import { toast } from 'react-toastify';
import { FormGender } from "../form/formGender";
import { SubmitButton } from "../form/submitButton";

export function EditGender({ onUserUpdate }) {
    const token = localStorage.getItem("token");
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
 
    const handleOpen = () => setOpen(!open);

    const handleSubmit = async (data) => {
        try {
            setIsLoading(true)
            await Axios.patch(
                "edits/gender",
                data,
                { headers: { Authorization: `Bearer ${token}` }}
            )
            handleOpen()
            toast.success('Gender successfully updated!');
            onUserUpdate()
        } catch (error) {
            console.log(error);
            toast.error('Failed to update Gender!');
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <EditButton tooltip={"Edit Gender"} handleOpen={handleOpen}/>
            <Dialog size="xs" open={open} handler={handleOpen}>
                <Card shadow={false} className="mx-auto w-full">
                    <CardBody className="flex flex-col items-center justify-center">
                        <Typography variant="h4" color="blue-gray">
                            Edit Gender
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            Change your account gender
                        </Typography>
                        <Formik
                            initialValues={{ gender: '' }}
                            onSubmit={(values, action) => {
                                handleSubmit(values)
                                action.resetForm()
                            }}
                        >
                            <Form className="mt-8 w-full sm:w-96">
                                <div className="flex flex-col gap-5">
                                    <FormGender />
                                    <SubmitButton isLoading={isLoading} buttonName={"Save"} />
                                </div>
                            </Form>
                        </Formik>
                    </CardBody>
                </Card>
            </Dialog>
        </>
    );
}