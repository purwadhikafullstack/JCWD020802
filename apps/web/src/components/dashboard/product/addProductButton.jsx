import { Card, Button, Typography, CardBody, Dialog } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import { Axios } from "../../../lib/api";
import { SubmitButton } from "../../form/submitButton";
import { FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setSelectedCategory } from "../../../redux/productSlice";
import { FormProductName } from "../../form/formProductName";
import { FormProductWeight } from "../../form/formProductWeight";
import { FormProductDetail } from "../../form/formProductDetail";
import { FormProductPrice } from "../../form/formProductPrice";
import { FormCategoryList } from "../../form/formCategoryList";

const ProductSchema = Yup.object().shape({
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
 
export function AddProductButton({ handleProductUpdate }) {
    const adminToken = localStorage.getItem('adminToken');
    const [openProduct, setOpenProduct] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()

    const handleOpenProduct = () => {
        setOpenProduct(true)
    };

    const handleCloseProduct = () => {
        dispatch(setSelectedCategory(null))
        setOpenProduct(false)
    }

    const handleSubmit = async (data) => {
        const config = {
            headers: { Authorization: `Bearer ${adminToken}` }
        }
        try {
            setIsLoading(true)
            await Axios.post("products/add", data, config);
            handleCloseProduct()
            handleProductUpdate()
            toast.success('Product successfully added!');
        } catch (error) {
            handleCloseProduct()
            if (error.response.status == 401) {
                toast.error('Product is already exist!');
            } else {
                toast.error('Failed to add product. Please try again.')
            }
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className="w-full">
            <Button onClick={handleOpenProduct} className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-300">
                <FaPlus />
                <Typography variant="h6" className="text-xs">Product</Typography>
            </Button>
            <Dialog
                size="xs"
                open={openProduct}
                handler={handleCloseProduct}
                className="bg-transparent shadow-none"
            >
                <Card shadow={false} className="mx-auto w-full">
                    <CardBody className="flex flex-col items-center justify-center">
                        <Typography variant="h4" color="blue-gray">
                            Add Product
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal text-center">
                            Nice to meet you! Please enter the new product data you want to add.
                        </Typography>
                        <Formik
                            initialValues={{ 
                                productName: '',
                                productWeight: 0,
                                productDetail: '',
                                productPrice: 0,
                                ProductCategoryId: ''
                            }}
                            validationSchema={ProductSchema}
                            onSubmit={(values, action) => {
                                handleSubmit(values)
                                action.resetForm()
                            }}
                        >
                            {({setFieldValue}) => (
                                <Form className="mt-8 w-full">
                                    <div className="flex flex-col gap-6">
                                        <FormProductName />
                                        <FormProductWeight />
                                        <FormProductDetail />
                                        <FormProductPrice />
                                        <FormCategoryList setFieldValue={setFieldValue} />
                                        <SubmitButton isLoading={isLoading} buttonName={"Add"} />
                                    </div>  
                                </Form>
                            )}
                        </Formik>
                    </CardBody>
                </Card>
            </Dialog>
        </div>
    );
}