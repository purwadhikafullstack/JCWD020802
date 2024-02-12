import { Card, Typography, CardBody, Dialog, } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Axios } from "../../lib/api";
import { toast } from 'react-toastify';
import { SubmitButton } from "../form/submitButton";
import { EditButton } from "./editButton";
import { FormCategoryName } from "../form/formCategoryName";

const EditCategorySchema = Yup.object().shape({ categoryName: Yup.string() })
 
export function EditCategoryButton({ category, handleCategoryUpdate }) {
    const adminToken = localStorage.getItem('adminToken');
    const [open, setOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
 
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setPreviewImage(null)
        setOpen(false);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            setFile(selectedFile);
            setPreviewImage(URL.createObjectURL(selectedFile));
        } else {
            setFile(null);
            setPreviewImage(category.categoryPicture);
        }
    };

    const handleSubmit = async (data) => {
        const formData = new FormData();
        formData.append('categoryName', data.categoryName);

        if (file) {
            formData.append('file', file);
        }

        const config = {
            headers: { Authorization: `Bearer ${adminToken}` },
            'Content-Type': 'multipart/form-data'
        }
        try {
            setIsLoading(true)
            await Axios.patch(`categories/edit/${category.id}`, formData, config)
            handleClose()
            toast.success('Category successfully updated!');
            handleCategoryUpdate()
        } catch (error) {
            handleClose()
            toast.error('Failed to update Category!');
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <EditButton tooltip={"Edit Category"} handleOpen={handleOpen}/>
            <Dialog size="xs" open={open} handler={handleClose}>
                <Card shadow={false} className="mx-auto w-full">
                    <CardBody className="flex flex-col items-center justify-center">
                        <Typography variant="h4" color="blue-gray">
                            Edit Category
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            Change selected category
                        </Typography>
                        <Formik
                            initialValues={{ 
                                categoryName: category.categoryName,
                                file: category.categoryPicture,
                            }}
                            validationSchema={EditCategorySchema}
                            onSubmit={(values, action) => {
                                handleSubmit(values)
                                action.resetForm()
                            }}
                        >
                            <Form className="mt-8 w-full sm:w-96">
                                <div className="flex flex-col gap-5">
                                    <FormCategoryName />
                                    <div class="flex items-center justify-center w-full">
                                        <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                            {
                                                previewImage == null ?
                                                <img 
                                                    src={`http://localhost:8000/${category.categoryPicture}`} 
                                                    alt="Preview" 
                                                    className="max-w-full h-64 rounded-lg py-2" 
                                                /> :
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    className="max-w-full h-64 rounded-lg py-2"
                                                />
                                            }
                                            <input id="dropzone-file" type="file" accept="image/*" onChange={handleFileChange} class="hidden" />
                                        </label>
                                    </div>
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