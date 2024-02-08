import { Card, Typography, CardBody, Dialog } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Axios } from "../../lib/api";
import { toast } from 'react-toastify';
import { FormBirthdate } from "../form/formBirthdate";
import { SubmitButton } from "../form/submitButton";
import { EditButton } from "./editButton";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedDay, setSelectedMonth, setSelectedYear } from "../../redux/userSlice";

const DateSchema = Yup.object().shape({
  day: Yup.string().required('Day is required'),
  month: Yup.string().required('Month is required'),
  year: Yup.string().required('Year is required'),
});

export function EditBirthdate({ onUserUpdate }) {
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.user.value);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch()

  const userBirthdate = user.birthdate ? user.birthdate.split(" ") : []

    const months = [
        { id: 1, name: 'January' },
        { id: 2, name: 'February' },
        { id: 3, name: 'March' },
        { id: 4, name: 'April' },
        { id: 5, name: 'May' },
        { id: 6, name: 'June' },
        { id: 7, name: 'July' },
        { id: 8, name: 'August' },
        { id: 9, name: 'September' },
        { id: 10, name: 'October' },
        { id: 11, name: 'November' },
        { id: 12, name: 'December' }
    ]

    const findMonthId = user.birthdate ? months.find(month => month.name === userBirthdate[1]) : null
    
    const handleOpen = () => {
        if (user.birthdate) {
            dispatch(setSelectedDay({ label: userBirthdate[0], value: userBirthdate[0] }))
            dispatch(setSelectedMonth({ label: userBirthdate[1], value: userBirthdate[1], id: findMonthId.id }))
            dispatch(setSelectedYear({ label: userBirthdate[2], value: userBirthdate[2] }))
        } else {
            dispatch(setSelectedDay(null))
            dispatch(setSelectedMonth(null))
            dispatch(setSelectedYear(null))
        }
        setOpen(true)
    }

    const handleClose = () => {
        dispatch(setSelectedDay(null))
        dispatch(setSelectedMonth(null))
        dispatch(setSelectedYear(null))
        setOpen(false)
    }

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
      toast.error('Failed to update Fullname!');
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <>
      <EditButton tooltip={"Edit Birthdate"} handleOpen={handleOpen}/>
      <Dialog size="xs" open={open} handler={handleClose}>
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
                day: userBirthdate[0],
                month: userBirthdate[1],
                year: userBirthdate[2]
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
