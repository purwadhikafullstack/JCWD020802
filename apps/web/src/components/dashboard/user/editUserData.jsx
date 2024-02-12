import { Dialog, DialogHeader, DialogBody } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import { Axios } from "../../../lib/api";
import { toast } from 'react-toastify';
import { FormFullname } from "../../form/formFullname";
import { FormBirthdate } from "../../form/formBirthdate";
import { FormGender } from "../../form/formGender";
import { SubmitButton } from "../../form/submitButton";
import { EditButton } from "../../edit/editButton";
import { FormEmail } from "../../form/formEmail";
import { useDispatch } from "react-redux";
import { setSelectedDay, setSelectedGender, setSelectedMonth, setSelectedYear } from "../../../redux/userSlice";

YupPassword(Yup)

const EditSchema = Yup.object().shape({
    fullname: Yup.string().required("Fullname is required"),
    day: Yup.string().required('Day is required'),
    month: Yup.string().required('Month is required'),
    year: Yup.string().required('Year is required'),
    gender: Yup.string().required("Gender is required"),
    email: Yup.string().email("Invalid email address format"),
    password: Yup.string().password(),
    passwordConfirmation: Yup.string().oneOf([Yup.ref('password')], 'Password must match!')
})
 
export function EditUserData({ user, handleUserUpdate }) {
    const adminToken = localStorage.getItem('adminToken');
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
        dispatch(setSelectedGender(user.gender))
        setOpen(true)
    }

    const handleClose = () => {
        dispatch(setSelectedDay(null))
        dispatch(setSelectedMonth(null))
        dispatch(setSelectedYear(null))
        dispatch(setSelectedGender(null))
        setOpen(false)
    }

    const handleSubmit = async (data) => {
        const config = {
            headers: { Authorization: `Bearer ${adminToken}` }
        }
        try {
            setIsLoading(true)
            await Axios.patch(
                `admins/edit-user/${user.id}`,
                {
                    fullname: data.fullname,
                    birthdate: `${data.day} ${data.month} ${data.year}`,
                    gender: data.gender,
                    email: data.email
                },
                config
            )
            handleClose()
            handleUserUpdate()
            toast.success('User successfully changed!');
        } catch (error) {
            handleClose()
            console.log(error);
            toast.error('User data edit failed! Please try again!');
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <EditButton tooltip={"Edit User"} handleOpen={handleOpen}/>
            <Dialog open={open} handler={handleClose} className="flex flex-col max-h-full overflow-y-scroll">
                <DialogHeader className="flex items-center justify-center">
                    Edit User Data
                </DialogHeader>
                <DialogBody>
                    <div className="flex flex-col w-full items-center justify-center">
                        <Formik
                            initialValues={{
                                fullname: user.fullname,
                                day: userBirthdate[0],
                                month: userBirthdate[1],
                                year: userBirthdate[2],
                                gender: user.gender,
                                email: user.email
                            }}
                            validationSchema={EditSchema}
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
                                        <FormEmail />
                                        <SubmitButton isLoading={isLoading} buttonName={"Save"} />
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </DialogBody>
            </Dialog>
        </>
    );
}