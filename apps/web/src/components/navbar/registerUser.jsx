import {
  Card,
  Input,
  Button,
  Typography,
  CardBody,
} from "@material-tailwind/react";
import { useState } from 'react'
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import { BiSolidShow, BiSolidHide } from "react-icons/bi";

YupPassword(Yup)

const RegisterSchema = Yup.object().shape({
    fullname: Yup.string()
        .required("Fullname is required"),
    gender: Yup.string()
        .required("Gender is required"),    
    username: Yup.string()
        .min(3, "Username must be 3 characters at minimum")
        .required("Username is required"),
    email: Yup.string()
        .email("Invalid email address format")
        .required("Email is required"),
    password: Yup.string()
        .password()
        .required("Password is required"),
    passwordConfirmation: Yup.string()
        .oneOf([Yup.ref('password')], 'Password must match!')       
        .required('Password confirmation is required')
})
 
export function RegisterUser() {
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)

    const handleSubmit = async (data) => {
        try {
            await axios.post("http://localhost:2000/users/register", data)
            alert("Register Success")
        } catch (error) {
            console.log(error);
            alert("Error")
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
                        username: '',
                        email: '',
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
                                    type="fullname"
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
                                <Field
                                    as={Input}
                                    name="gender"
                                    type="gender"
                                    placeholder="Gender..."
                                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                    labelProps={{
                                        className: "before:content-none after:content-none",
                                    }}
                                />
                                <ErrorMessage
                                    component="FormControl"
                                    name="gender"
                                    style={{ color: "red"}}
                                />
                            </div>
                            <div className="mb-1 flex flex-col">
                                <Typography variant="h6" color="blue-gray" className="mb-2">
                                    Username
                                </Typography>
                                <Field
                                    as={Input}
                                    name="username"
                                    type="username"
                                    placeholder="Your Username..."
                                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                    labelProps={{
                                        className: "before:content-none after:content-none",
                                    }}
                                />
                                <ErrorMessage
                                    component="FormControl"
                                    name="username"
                                    style={{ color: "red"}}
                                />
                            </div>
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
                                    <Button className="h-10 ml-1 flex items-center justify-center" onClick={() => setShowPassword((showPassword) => !showPassword)}>
                                        {showPassword ? <BiSolidShow fontSize={"30px"}/> : <BiSolidHide fontSize={"30px"}/>}
                                    </Button>
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
                                    <Button className="h-10 ml-1 flex items-center justify-center" onClick={() => setShowPasswordConfirmation((showPasswordConfirmation) => !showPasswordConfirmation)}>
                                        {showPasswordConfirmation ? <BiSolidShow fontSize={"30px"}/> : <BiSolidHide fontSize={"30px"}/>}
                                    </Button>
                                </div>
                                <ErrorMessage
                                    component="FormControl"
                                    name="passwordConfirmation"
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
                            >
                                Register
                            </Button>
                        </div>
                    </Form>
                </Formik>
            </CardBody>
        </Card>
    );
}