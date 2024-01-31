import { Card, Typography, CardBody, Dialog, Button } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Axios } from "../../lib/api";
import { toast } from 'react-toastify';
import { SubmitButton } from "../form/submitButton";
import { FormPassword } from "../form/formPassword";
import { useNavigate, useParams } from "react-router-dom";

const PasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .password()
    .required("Password is required"),
  newPasswordConfirmation: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Password must match!')       
    .required('Password confirmation is required')
});

export function ResetPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const params = useParams()
    const navigate = useNavigate()

    const handleSubmit = async (data) => {
        const config = {
            headers: { Authorization: `Bearer ${params.token}` }
        }
        try {
            setIsLoading(true)
            await Axios.patch("edits/reset-password", data, config);
            navigate("/")
            toast.success('Password successfully changed!');
        } catch (error) {
            toast.error('Failed reset password!');
        } finally {
            setIsLoading(false)
        }
    };

  return (
    <Card shadow={false} className="mx-auto my-3 w-full border-solid border-brown-500 border-2 sm:w-3/5">
        <CardBody className="flex flex-col w-full items-center justify-center">
            <Typography variant="h4" color="blue-gray">
                Reset Password
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
                Reset your account password
            </Typography>
            <Formik
                initialValues={{
                    newPassword: '',
                    newPasswordConfirmation: ''
                }}
                validationSchema={PasswordSchema}
                onSubmit={(values, action) => {
                    handleSubmit(values);
                    action.resetForm();
                }}
            >
                <Form className="mt-8 w-full flex items-center justify-center">
                    <div className="flex flex-col gap-5 w-full">
                        <FormPassword label={"New Password"} keyName={"newPassword"} />
                        <FormPassword label={"Confirm New Password"} keyName={"newPasswordConfirmation"} />
                        <SubmitButton isLoading={isLoading} buttonName={"Reset"} />
                    </div>
                </Form>
            </Formik>
        </CardBody>
    </Card>
  );
}
