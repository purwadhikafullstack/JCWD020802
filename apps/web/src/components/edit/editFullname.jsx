import { Card, Typography, CardBody, Dialog, } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Axios } from "../../lib/api";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { FormFullname } from "../form/formFullname";
import { SubmitButton } from "../form/submitButton";
import { EditButton } from "./editButton";

const EditFullnameSchema = Yup.object().shape({ fullname: Yup.string() })
 
export function EditFullname({ onUserUpdate }) {
    const user = useSelector((state) => state.user.value)
    const token = localStorage.getItem("token");
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
 
    const handleOpen = () => setOpen(!open);

    const handleSubmit = async (data) => {
        try {
            setIsLoading(true)
            await Axios.patch(
                "edits/fullname", 
                data,
                { headers: { Authorization: `Bearer ${token}` }}
            )
            handleOpen()
            toast.success('Fullname successfully updated!');
            onUserUpdate()
        } catch (error) {
            console.error(error);
            toast.error('Failed to update Fullname!');
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <EditButton tooltip={"Edit Fullname"} handleOpen={handleOpen}/>
            <Dialog size="xs" open={open} handler={handleOpen}>
                <Card shadow={false} className="mx-auto w-full">
                    <CardBody className="flex flex-col items-center justify-center">
                        <Typography variant="h4" color="blue-gray">
                            Edit Fullname
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            Change your account fullname
                        </Typography>
                        <Formik
                            initialValues={{ fullname: user.fullname }}
                            validationSchema={EditFullnameSchema}
                            onSubmit={(values, action) => {
                                handleSubmit(values)
                                action.resetForm()
                            }}
                        >
                            <Form className="mt-8 w-full sm:w-96">
                                <div className="flex flex-col gap-5">
                                    <FormFullname />
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