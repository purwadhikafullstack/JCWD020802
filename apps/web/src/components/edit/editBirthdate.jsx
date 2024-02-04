import { Card, Typography, CardBody, Dialog } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Axios } from "../../lib/api";
import { toast } from 'react-toastify';
import { FormBirthdate } from "../form/formBirthdate";
import { SubmitButton } from "../form/submitButton";
import { EditButton } from "./editButton";

const DateSchema = Yup.object().shape({
  day: Yup.string().required('Day is required'),
  month: Yup.string().required('Month is required'),
  year: Yup.string().required('Year is required'),
});

export function EditBirthdate({ onUserUpdate }) {
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = () => setOpen(!open)

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true)
      await Axios.patch(
        "edits/birthdate",
        { newBirthdate: `${data.day} ${data.month} ${data.year}` },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      handleOpen()
      toast.success('Birthdate successfully updated!');
      onUserUpdate()
    } catch (error) {
      console.log(error);
      toast.error('Failed to update Fullname!');
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <>
      <EditButton tooltip={"Edit Birthdate"} handleOpen={handleOpen}/>
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
                day: '',
                month: '',
                year: ''
              }}
              validationSchema={DateSchema}
              onSubmit={(values, action) => {
                handleSubmit(values);
                action.resetForm();
              }}
            >
              {({ setFieldValue }) => (
                <Form className="mt-8 w-full flex items-center justify-center">
                  <div className="flex flex-col gap-5 w-full">
                    <FormBirthdate setFieldValue={setFieldValue} />
                    <SubmitButton isLoading={isLoading} buttonName={"Save"} />
                  </div>
                </Form>
              )}
            </Formik>
          </CardBody>
        </Card>
      </Dialog>
    </>
  );
}
