import { Card, Button, Typography, CardBody, Tooltip, IconButton, Dialog } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form, Field } from "formik";
import { Axios } from "../../lib/api";
import { HiMiniPencilSquare } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { FaMale, FaFemale } from "react-icons/fa"; 

export function EditGender() {
    const user = useSelector((state) => state.user.value)
    const token = localStorage.getItem("token");
    const [open, setOpen] = useState(false);
 
    const handleOpen = () => setOpen(!open);

    const handleSubmit = async (data) => {
        try {
            await Axios.patch(
                "edits/gender",
                data,
                { headers: { Authorization: `Bearer ${token}` }}
            )
            alert("Gender successfully changed")
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
                            Change Gender
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            Change your account gender
                        </Typography>
                        <Formik
                            initialValues={{ gender: user.gender }}
                            onSubmit={(values, action) => {
                                handleSubmit(values)
                                action.resetForm()
                            }}
                        >
                            <Form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                                <div className="mb-1 flex flex-col gap-6">
                                    <div className="mb-1 flex flex-col">
                                        <Typography variant="h6" color="blue-gray" className="mb-2">
                                            Gender
                                        </Typography>
                                        <div role="group" className="flex justify-center">
                                            <label className="mx-3 flex mr-10">
                                                <Field name="gender" type="radio" value="Male"/>
                                                <FaMale fontSize={'50px'} color="blue"/>
                                                <Typography variant="lead" className="flex items-center">Male</Typography>
                                            </label>
                                            <label className="mx-3 flex">
                                                <Field name="gender" type="radio" value="Female" />
                                                <FaFemale fontSize={'50px'} color="red"/>
                                                <Typography variant="lead" className="flex items-center">Female</Typography>
                                            </label>
                                        </div>
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