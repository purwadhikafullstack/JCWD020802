import {
  Card,
  Input,
  Button,
  Typography,
  CardBody,
  Checkbox,
} from "@material-tailwind/react";
import { useState } from 'react'
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import { BiSolidShow, BiSolidHide } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { setData } from "../../redux/userSlice";

YupPassword(Yup)

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address format")
        .required("Email is required"),
    password: Yup.string()
        .password()
        .required("Password is required"),
})
 
export function Login() {
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false)

    const handleOpen = () => setOpen((cur) => !cur)
    
    const handleSubmit = async (data) => {
    try {
      const response = await axios.get(`http://localhost:2000/users/login?email=${data.email}&password=${data.password}`)
      if (response.data.token) {
        dispatch(setData(response.data.checkLogin));
        localStorage.setItem("token", response.data?.token);
        window.location.reload()
        alert('Login Success')
      } else {
        alert('Account not found')
      }
    } catch (error) {
      console.log(error);
      alert('Login Failed')
    }
  }

    return (
        <Card shadow={false} className="mx-auto w-full">
            <CardBody className="flex flex-col items-center justify-center">
                <Typography variant="h4" color="blue-gray">
                    Log In
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                    Enter your email and password to Log In.
                </Typography>
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                    }}
                    validationSchema={LoginSchema}
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
                            <div className="-ml-2.5 -mt-3">
                                <Checkbox label="Remember Me" />
                            </div>
                            <Button
                                type='submit'
                                loadingText="Submitting"
                                size="lg"
                                isLoading={false}
                                className="mt-2" 
                                fullWidth
                            >
                                Log In
                            </Button>
                            <Typography
                                as="a"
                                href="#forgot-password"
                                variant="small"
                                color="blue-gray"
                                className="ml-1 font-bold"
                                onClick={handleOpen}
                            >
                                Forgot password?
                            </Typography>
                        </div>
                    </Form>
                </Formik>
            </CardBody>
        </Card>
    );
}