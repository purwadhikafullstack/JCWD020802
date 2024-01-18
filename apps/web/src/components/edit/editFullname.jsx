import { Card, Input, Button, Typography, CardBody, Tooltip, IconButton, Dialog, } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Axios } from "../../lib/api";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { useSelector } from "react-redux";

const EditFullnameSchema = Yup.object().shape({ fullname: Yup.string() })
 
export function EditFullname() {
    const user = useSelector((state) => state.user.value)
    const token = localStorage.getItem("token");
    const [open, setOpen] = useState(false);
 
    const handleOpen = () => setOpen(!open);

    const handleSubmit = async (data) => {
        try {
            await Axios.patch(
                "edits/fullname", 
                data,
                { headers: { Authorization: `Bearer ${token}` }}
            )
            alert("Fullname successfully changed")
            window.location.reload();
        } catch (error) {
            console.log(error);
            alert("Error")
        }
    }

    return (
        <>
            <Tooltip content="Change">
                <IconButton onClick={handleOpen} variant="text">
                    <HiMiniPencilSquare color="brown" className="h-4 w-4" />
                </IconButton>
            </Tooltip>

            <Dialog size="xs" open={open} handler={handleOpen}>
                <Card shadow={false} className="mx-auto w-full">
                    <CardBody className="flex flex-col items-center justify-center">
                        <Typography variant="h4" color="blue-gray">
                            Change Fullname
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
                            <Form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                                <div className="mb-1 flex flex-col gap-6">
                                    <div className="mb-1 flex flex-col">
                                        <Typography variant="h6" color="blue-gray" className="mb-2">
                                            Fullname
                                        </Typography>
                                        <Field
                                            as={Input}
                                            name="fullname"
                                            type="fullname"
                                            className=" !border-t-blue-gray-200 focus:!border-green-500"
                                            labelProps={{
                                                className: "before:content-none after:content-none",
                                            }}
                                        />
                                        <ErrorMessage
                                            component="FormControl"
                                            name="fullname"
                                            style={{ color: "red"}}
                                        />
                                    </div>
                                    <Button
                                        type='submit'
                                        loadingText="Submitting"
                                        size="lg"
                                        isLoading={false}
                                        className="mt-2" 
                                        fullWidth
                                        color="green"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </Form>
                        </Formik>
                    </CardBody>
                </Card>
            </Dialog>
        </>
    );
}