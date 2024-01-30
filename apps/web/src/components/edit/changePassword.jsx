import { Card, Typography, CardBody, Dialog, Button } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Axios } from "../../lib/api";
import { toast } from 'react-toastify';
import { SubmitButton } from "../form/submitButton";
import { FormPassword } from "../form/formPassword";

const PasswordSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .password()
    .required("Password is required"),
  newPassword: Yup.string()
    .password()
    .notOneOf([Yup.ref('oldPassword')], 'New Password must be different from Old Password')
    .required("Password is required"),
  newPasswordConfirmation: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'New password must match!')       
    .required('Password confirmation is required')
});

export function ChangePassword({ onUserUpdate }) {
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = () => setOpen(!open)

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true)
      await Axios.patch(
        "edits/change-password",
        data,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      handleOpen()
      toast.success('Password successfully changed!');
      onUserUpdate()
    } catch (error) {
      console.log(error);
      handleOpen()
      toast.error('Incorrect old password!');
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <>
      <Button fullWidth onClick={handleOpen} className="bg-green-600 hover:bg-green-300">
          Change Password
      </Button>
      <Dialog size="xs" open={open} handler={handleOpen}>
        <Card shadow={false} className="mx-auto w-full">
          <CardBody className="flex flex-col items-center justify-center">
            <Typography variant="h4" color="blue-gray">
              Edit Birthdate
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              Change your account birthdate
            </Typography>
            <Formik
              initialValues={{
                oldPassword: '',
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
                  <FormPassword label={"Old Password"} keyName={"oldPassword"} />
                  <FormPassword label={"New Password"} keyName={"newPassword"} />
                  <FormPassword label={"Confirm New Password"} keyName={"newPasswordConfirmation"} />
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
