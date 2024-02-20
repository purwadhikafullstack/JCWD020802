import { Card, Typography, CardBody, Dialog, } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Axios } from "../../lib/api";
import { toast } from 'react-toastify';
import { SubmitButton } from "../form/submitButton";
import { EditButton } from "./editButton";
import { useDispatch } from "react-redux";
import { FormProductName } from "../form/formProductName";
import { FormProductWeight } from "../form/formProductWeight";
import { FormProductDetail } from "../form/formProductDetail";
import { FormProductPrice } from "../form/formProductPrice";
import { FormCategoryList } from "../form/formCategoryList";
import { setSelectedCategory } from "../../redux/productSlice";

const EditProductSchema = Yup.object().shape({
    productName: Yup.string().required("Product name is required"),
    productWeight: Yup.number()
        .integer("Product weight must number")
        .positive("Product weight must in positive number"),
    productDetail: Yup.string().required("Product detail is required"),
    productPrice: Yup.number()
        .integer("Product price must number")
        .positive("Product price must in positive number"),
    ProductCategoryId: Yup.string().required("Product category is required"),
})
 
export function EditProductButton({ product, handleProductUpdate }) {
    const adminToken = localStorage.getItem('adminToken');
    const [open, setOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()
 
    const handleOpen = (product) => {
        dispatch(setSelectedCategory({label: product.ProductCategory.categoryName, value: product.ProductCategoryId}))
        setOpen(true);
    };

    const handleClose = () => {
        dispatch(setSelectedCategory(null))
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
            setPreviewImage(product.productMainPicture);
        }
    };

    const handleSubmit = async (data) => {
        const formData = new FormData();
        formData.append('productName', data.productName);
        formData.append('productWeight', data.productWeight);
        formData.append('productDetail', data.productDetail);
        formData.append('productPrice', data.productPrice);
        formData.append('ProductCategoryId', data.ProductCategoryId);

        if (file) {
            formData.append('file', file);
        }

        const config = {
            headers: { Authorization: `Bearer ${adminToken}` },
            'Content-Type': 'multipart/form-data'
        }
        try {
            setIsLoading(true)
            await Axios.patch(`products/edit/${product.id}`, formData, config);
            handleClose()
            handleProductUpdate()
            toast.success('Product successfully updated!');
        } catch (error) {
            handleClose()
            console.log(error);
            toast.error('Failed to update product!');
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <>
            <EditButton tooltip={"Edit Product"} handleOpen={() => handleOpen(product)}/>
            <Dialog size="sm" open={open} handler={handleClose}>
                <Card shadow={false} className="mx-auto w-full">
                    <CardBody className="flex flex-col items-center justify-center">
                        <Typography variant="h4" color="blue-gray">
                            Edit Product
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            Change selected product
                        </Typography>
                        <Formik
                            initialValues={{ 
                                productName: product.productName,
                                productWeight: product.productWeight,
                                productDetail: product.productDetail,
                                productPrice: product.productPrice,
                                ProductCategoryId: product.ProductCategoryId,
                                file: product.productMainPicture,
                            }}
                            validationSchema={EditProductSchema}
                            onSubmit={(values, action) => {
                                handleSubmit(values)
                                action.resetForm()
                            }}
                        >
                            {({setFieldValue}) => (
                                <Form className="mt-8 w-full">
                                    <div className="flex flex-col gap-5">
                                        <FormProductName />
                                        <FormProductWeight />
                                        <FormProductDetail />
                                        <FormProductPrice />
                                        <FormCategoryList setFieldValue={setFieldValue} />
                                        <div class="flex items-center justify-center w-full">
                                            <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                                {
                                                    previewImage == null ?
                                                    <img 
                                                        src={`${import.meta.env.VITE_LOCAL_HOST}${product.productMainPicture}`} 
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
                            )}
                        </Formik>
                    </CardBody>
                </Card>
            </Dialog>
        </>
    );
}