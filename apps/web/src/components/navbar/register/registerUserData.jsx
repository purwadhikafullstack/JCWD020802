import { Card, Typography, CardBody } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import { Axios } from "../../../lib/api";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { FormFullname } from "../../form/formFullname";
import { FormBirthdate } from "../../form/formBirthdate";
import { FormGender } from "../../form/formGender";
import { FormPassword } from "../../form/formPassword";
import { SubmitButton } from "../../form/submitButton";

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
            toast.success('Email has been verified & register success!');
            toast.success('Please try to login with your new account!')
        } catch (error) {
            toast.error('Register Failed! Please try again!');
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card shadow={false} className="mx-auto my-3 w-full border-solid border-brown-500 border-2 sm:w-3/5">
            <CardBody className="flex flex-col w-full items-center justify-center">
                <Typography variant="h4" color="blue-gray">
                    Register
                </Typography>
                <Typography color="gray" className="mt-1 font-normal text-center">
                    Nice to meet you! Please enter your details to register.
                </Typography>
                <Formik
                    initialValues={{
                        fullname: '',
                        birthdate: '',
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
                    {({ setFieldValue }) => (
                        <Form className="mt-8 w-full">
                            <div className="flex flex-col gap-6">
                                <FormFullname />
                                <FormBirthdate setFieldValue={setFieldValue} />
                                <FormGender />
                                <FormPassword label={'Password'} keyName={'password'} />
                                <FormPassword label={'Password Confirmation'} keyName={'passwordConfirmation'} />
                                <SubmitButton isLoading={isLoading} buttonName={"Verify & Register Account"} />
                            </div>
                        </Form>
                    )}
                </Formik>
            </CardBody>
        </Card>
    );
}