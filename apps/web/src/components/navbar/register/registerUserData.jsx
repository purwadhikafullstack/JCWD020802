import { Card, Input, Button, Typography, CardBody, IconButton } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import { BiSolidShow, BiSolidHide } from "react-icons/bi";
import { Axios } from "../../../lib/api";
import { useParams, useNavigate } from "react-router-dom";
import { FaMale, FaFemale } from "react-icons/fa"; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";

YupPassword(Yup)

const RegisterSchema = Yup.object().shape({
    fullname: Yup.string()
        .required("Fullname is required"),
    gender: Yup.string()
        .required("Gender is required"),    
    password: Yup.string()
        .password()
        .required("Password is required"),
    passwordConfirmation: Yup.string()
        .oneOf([Yup.ref('password')], 'Password must match!')       
        .required('Password confirmation is required')
})
 
export function RegisterUserData() {
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const params = useParams()
    const navigate = useNavigate()

    const handleSubmit = async (data) => {
        const config = {
            headers: { Authorization: `Bearer ${params.token}` }
        }
        try {
            setIsLoading(true)
            await Axios.patch("users/register-user", data, config)
            navigate("/")
            toast.success('Register Success!');
        } catch (error) {
            console.log(error);
            toast.error('Register Failed!');
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card shadow={false} className="mx-auto w-full">
            <CardBody className="flex flex-col items-center justify-center">
                <Typography variant="h4" color="blue-gray">
                    Register
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                    Nice to meet you! Please enter your details to register.
                </Typography>
                <Formik
                    initialValues={{
                        fullname: '',
                        gender: '',
                        password: '',
                        passwordConfirmation: ''
                    }}
                    validationSchema={RegisterSchema}
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
                                    placeholder="Your Fullname..."
                                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
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
                                <ErrorMessage
                                    component="FormControl"
                                    name="gender"
                                    style={{ color: "red"}}
                                />
                            </div>
                            <div className="mb-1 flex flex-col">
                                <Typography variant="h6" color="blue-gray" className="mb-2">
                                    Password
                                </Typography>
                                <div className="flex">
                                    <Field
                                        as={Input}
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="********"
                                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                        labelProps={{
                                            className: "before:content-none after:content-none",
                                        }}
                                    />
                                    <IconButton variant="text" className="h-10 ml-1 flex items-center justify-center" onClick={() => setShowPassword((showPassword) => !showPassword)}>
                                        {showPassword ? <BiSolidShow fontSize={"30px"}/> : <BiSolidHide fontSize={"30px"}/>}
                                    </IconButton>
                                </div>
                                <ErrorMessage
                                    component="FormControl"
                                    name="password"
                                    style={{ color: "red"}}
                                />
                            </div>
                            <div className="mb-1 flex flex-col">
                                <Typography variant="h6" color="blue-gray" className="mb-2">
                                    Password Confirmation
                                </Typography>
                                <div className="flex">
                                    <Field
                                        as={Input}
                                        name="passwordConfirmation"
                                        type={showPasswordConfirmation ? 'text' : 'password'}
                                        placeholder="********"
                                        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                        labelProps={{
                                            className: "before:content-none after:content-none",
                                        }}
                                    />
                                    <IconButton variant="text" className="h-10 ml-1 flex items-center justify-center" onClick={() => setShowPasswordConfirmation((showPasswordConfirmation) => !showPasswordConfirmation)}>
                                        {showPasswordConfirmation ? <BiSolidShow fontSize={"30px"}/> : <BiSolidHide fontSize={"30px"}/>}
                                    </IconButton>
                                </div>
                                <ErrorMessage
                                    component="FormControl"
                                    name="passwordConfirmation"
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
                                    "Verify & Register Account"
                                }
                            </Button>
                        </div>
                    </Form>
                </Formik>
            </CardBody>
        </Card>
    );
}