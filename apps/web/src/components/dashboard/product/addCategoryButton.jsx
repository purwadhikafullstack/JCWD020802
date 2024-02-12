import { Card, Button, Typography, CardBody, Dialog } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import { Axios } from "../../../lib/api";
import { SubmitButton } from "../../form/submitButton";
import { FaPlus } from "react-icons/fa";
import { FormCategoryName } from "../../form/formCategoryName";

const CategorySchema = Yup.object().shape({
    categoryName: Yup.string().required("Category name is required")
})
 
export function AddCategoryButton({ handleCategoryUpdate }) {
    const adminToken = localStorage.getItem('adminToken');
    const [openCategory, setOpenCategory] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const handleOpenCategory = () => setOpenCategory(true);

    const handleCloseCategory = () => {
        setOpenCategory(false),
        setPreviewImage(null)
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            setFile(selectedFile);
            setPreviewImage(URL.createObjectURL(selectedFile));
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
            await Axios.post("categories/add", formData, config);
            handleCloseCategory()
            handleCategoryUpdate()
            toast.success('Category successfully added!');
        } catch (error) {
            handleCloseCategory()
            if (error.response.status == 401) {
                toast.error('Category is already exist!');
            } else {
                toast.error('Failed to add category. Please try again.')
            }
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className="w-full">
            <Button onClick={handleOpenCategory} className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-300">
                <FaPlus />
                <Typography variant="h6" className="text-xs">Category</Typography>
            </Button>
            <Dialog
                size="xs"
                open={openCategory}
                handler={handleCloseCategory}
                className="bg-transparent shadow-none h-fit overflow-scroll"
            >
                <Card shadow={false} className="mx-auto w-full">
                    <CardBody className="flex flex-col items-center justify-center">
                        <Typography variant="h4" color="blue-gray">
                            Add Category
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal text-center">
                            Nice to meet you! Please enter the new category name you want to add.
                        </Typography>
                        <Formik
                            initialValues={{ categoryName: '' }}
                            validationSchema={CategorySchema}
                            onSubmit={(values, action) => {
                                handleSubmit(values)
                                action.resetForm()
                            }}
                        >
                            <Form className="mt-8 w-full">
                                <div className="flex flex-col gap-6">
                                    <FormCategoryName />
                                    <div class="flex items-center justify-center w-full">
                                        <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                            {
                                                previewImage == null ?
                                                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                    </svg>
                                                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                                    <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                                </div> :
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    className="max-w-full h-64 rounded-lg py-2"
                                                />
                                            }
                                            <input id="dropzone-file" type="file" accept="image/*" onChange={handleFileChange} class="hidden" />
                                        </label>
                                    </div>
                                    <SubmitButton isLoading={isLoading} buttonName={"Add"} />
                                </div>  
                            </Form>
                        </Formik>
                    </CardBody>
                </Card>
            </Dialog>
        </div>
    );
}