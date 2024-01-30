import {
  Card,
  Input,
  Button,
  Typography,
  CardBody,
  Checkbox,
  IconButton,
  Dialog,
} from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import { BiSolidShow, BiSolidHide } from "react-icons/bi";
import { setData } from "../../../redux/userSlice";
import { Axios } from "../../../lib/api";
import { LoginGoogle } from "./loginGoogle";
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { ClipLoader } from "react-spinners";

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
    const [openLogin, setOpenLogin] = useState(false);
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()

    const handleOpenLogin = () => setOpenLogin((cur) => !cur)
    const handleOpen = () => setOpen((cur) => !cur)
    
    const handleSubmit = async (data) => {
        try {
            setIsLoading(true)
            const response = await Axios.get(`users/login?email=${data.email}&password=${data.password}`)
            if (response.data.token) {
                dispatch(setData(response.data));
                localStorage.setItem("token", response.data?.token);
                handleOpenLogin()
                toast.success('Login Success!')
                window.location.reload()
            } else {
                toast.error('Account not found!')
            }
        } catch (error) {
            handleOpenLogin()
            toast.error('Login Failed!')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full lg:w-24">
            <Button
                variant="outlined"
                size="sm"
                color="brown"
                className="w-full"
                onClick={handleOpenLogin}
            >
                <span>Log In</span>
            </Button>
            <Dialog
                size="sm"
                open={openLogin}
                handler={handleOpenLogin}
                className="bg-transparent shadow-none"
            >
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
                                    <div className="-ml-2.5 -mt-3">
                                        <Checkbox label="Remember Me" />
                                    </div>
                                    <Button
                                        type='submit'
                                        color='green'
                                        size="lg"
                                        disabled={isLoading}
                                        className="mt-2" 
                                        fullWidth
                                    >
                                        {
                                            isLoading ?
                                            <ClipLoader size={20} color={"#fff"} loading={isLoading} /> :
                                            "Log In"
                                        }
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
                                <LoginGoogle />
                            </Form>
                        </Formik>
                    </CardBody>
                </Card>
            </Dialog>
        </div>
    );
}