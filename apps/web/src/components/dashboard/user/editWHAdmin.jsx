import { Dialog, DialogHeader, DialogBody } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Axios } from "../../../lib/api";
import { toast } from 'react-toastify';
import { SubmitButton } from "../../form/submitButton";
import { EditButton } from "../../edit/editButton";
import { FormWarehouseList } from "../../form/formWarehouseList";
import { useDispatch } from "react-redux";
import { setSelectedWarehouse } from "../../../redux/stockSlice";

const AssignSchema = Yup.object().shape({
    WarehouseId: Yup.string().required("Warehouse is required"),
})
 
export function EditWHAdmin({ user, handleUserUpdate }) {
    const adminToken = localStorage.getItem('adminToken');
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()
    
    const handleOpen = () => {
        dispatch(setSelectedWarehouse(user.WarehouseAdmins[0]?.Warehouse.label))
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleSubmit = async (data) => {
        const config = {
            headers: { Authorization: `Bearer ${adminToken}` }
        }
        try {
            setIsLoading(true)
            await Axios.patch( `admins/edit-warehouse-admin/${user.id}`, data, config )
            handleClose()
            handleUserUpdate()
            toast.success('Warehouse Admin successfully updated!');
        } catch (error) {
            handleClose()
            toast.error('Update failed! Please try again!');
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <EditButton tooltip={"Edit Warehouse Admin"} handleOpen={handleOpen}/>
            <Dialog open={open} handler={handleClose} className="flex flex-col max-h-full overflow-y-scroll">
                <DialogHeader className="flex items-center justify-center">
                    Assign Warehouse Admin
                </DialogHeader>
                <DialogBody>
                    <div className="flex flex-col w-full items-center justify-center">
                        <Formik
                            initialValues={{
                                WarehouseId: user.WarehouseAdmins[0].WarehouseId
                            }}
                            validationSchema={AssignSchema}
                            onSubmit={(values, action) => {
                                handleSubmit(values)
                                action.resetForm()
                            }}
                        >
                            {({ setFieldValue }) => (
                                <Form className="mt-8 w-full">
                                    <div className="flex flex-col gap-6">
                                        <FormWarehouseList setFieldValue={setFieldValue}/>
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