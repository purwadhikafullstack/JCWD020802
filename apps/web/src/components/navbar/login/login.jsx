import { Card, Button, Typography, CardBody, Checkbox, Dialog } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import { setData } from "../../../redux/userSlice";
import { Axios } from "../../../lib/api";
import { LoginGoogle } from "./loginGoogle";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import { FormEmail } from "../../form/formEmail";
import { FormPassword } from "../../form/formPassword";
import { SubmitButton } from "../../form/submitButton";
import { ResendEmail } from "./resendEmail";
import { ForgotPassword } from "./forgotPassword";

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
    const user = useSelector((state) => state.user.value);
    const [openLogin, setOpenLogin] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()

    const handleOpenLogin = () => setOpenLogin((cur) => !cur)
    
    const handleSubmit = async (data) => {
        try {
            setIsLoading(true)
            const response = await Axios.get(`users/login?email=${data.email}&password=${data.password}`)
            if (response.data.token || response.data.adminToken) {
                dispatch(setData(response.data));
                if (response.data.token) {
                    localStorage.setItem("token", response.data?.token);   
                } else if (response.data.adminToken) {
                    localStorage.setItem("adminToken", response.data?.adminToken); 
                    // window.location.href = '/dashboard-admin';
                }
                handleOpenLogin()
                toast.success('Login Success!')
                window.location.reload();
            } else {
                toast.error('Account not found!')
            }
        } catch (error) {
            handleOpenLogin()
            if (error.response.status == 400) {
                toast.error('User not found! Please check your email!')
            } else if (error.response.status == 401) {
                toast.error('Your account is still not verified!')
                toast.error('Please check your verification email in your mail or resend verification email!')
            } else if (error.response.status == 402) {
                toast.error('Incorrect Password!')
            } else {
                toast.error('Login Failed! Please try again!')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full lg:w-24">
            <Button
                variant="outlined"
                size="sm"
                color="green"
                className="w-full"
                onClick={handleOpenLogin}
            >
                <span>Log In</span>
            </Button>
            <Dialog
                size="xs"
                open={openLogin}
                handler={handleOpenLogin}
                className="bg-transparent shadow-none"
            >
                <Card shadow={false} className="mx-auto w-full">
                    <CardBody className="flex flex-col items-center justify-center">
                        <Typography variant="h4" color="blue-gray">
                            Log In
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal text-center">
                            Enter your email and password to Log In.
                        </Typography>
                        <div className="mt-1 flex items-center justify-center">
                            <Typography color="gray" className="font-normal text-xs">
                                Email still not verified?
                            </Typography>
                            <ResendEmail handleOpenLogin={handleOpenLogin} />
                        </div>
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
                            <Form className="mt-8 w-full">
                                <div className="mb-1 flex flex-col gap-6">
                                    <FormEmail />
                                    <FormPassword label={"Password"} keyName={"password"} />
                                    <div className="-ml-2.5 -mt-3">
                                        <Checkbox label="Remember Me" />
                                    </div>
                                    <SubmitButton isLoading={isLoading} buttonName={"Log In"} />
                                </div>
                                <ForgotPassword handleOpenLogin={handleOpenLogin} />
                                <div class="relative flex py-5 items-center">
                                    <div class="flex-grow border-t border-gray-400"></div>
                                    <span class="flex-shrink mx-4">OR</span>
                                    <div class="flex-grow border-t border-gray-400"></div>
                                </div>
                                <LoginGoogle handleOpenLogin={handleOpenLogin} />
                            </Form>
                        </Formik>
                    </CardBody>
                </Card>
            </Dialog>
        </div>
    );
}