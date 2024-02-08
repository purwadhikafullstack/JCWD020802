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
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenCategory = () => setOpenCategory((cur) => !cur);

    const handleSubmit = async (data) => {
        const config = {
            headers: { Authorization: `Bearer ${adminToken}` }
        }
        try {
            setIsLoading(true)
            await Axios.post("categories/add", data, config);
            handleOpenCategory()
            handleCategoryUpdate()
            toast.success('Category successfully added!');
        } catch (error) {
            handleOpenCategory()
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
                handler={handleOpenCategory}
                className="bg-transparent shadow-none"
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