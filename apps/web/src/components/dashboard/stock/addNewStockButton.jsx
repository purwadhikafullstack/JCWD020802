import { Card, Button, Typography, CardBody, Dialog } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import { Axios } from "../../../lib/api";
import { SubmitButton } from "../../form/submitButton";
import { FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setSelectedProduct, setSelectedWarehouse } from "../../../redux/stockSlice";
import { FormStock } from "../../form/formStock";
import { FormWarehouseList } from "../../form/formWarehouseList";
import { FormProductList } from "../../form/formProductList";

const StockSchema = Yup.object().shape({
    WarehouseId: Yup.string().required("Warehouse is required"),
    ProductId: Yup.string().required("Product is required"),
    stock: Yup.number()
        .integer("Stock must a number")
        .positive("Stock must in positive number")
})
 
export function AddNewStockButton({ handleStockUpdate }) {
    const adminToken = localStorage.getItem('adminToken');
    const [openStock, setOpenStock] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()

    const handleOpenStock = () => {
        setOpenStock(true)
    };

    const handleCloseStock = () => {
        dispatch(setSelectedWarehouse(null))
        dispatch(setSelectedProduct(null))
        setOpenStock(false)
    }

    const handleSubmit = async (data) => {
        const config = {
            headers: { Authorization: `Bearer ${adminToken}` }
        }
        try {
            setIsLoading(true)
            await Axios.post("stocks/add", data, config);
            handleCloseStock()
            handleStockUpdate()
            toast.success('Stock successfully added!');
        } catch (error) {
            handleCloseStock()
            if (error.response.status == 401) {
                toast.error('Stock is already exist!');
            } else {
                toast.error('Failed to add stock. Please try again.')
            }
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className="w-full">
            <Button onClick={handleOpenStock} className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-300">
                <FaPlus />
                <Typography variant="h6" className="text-xs">New Stock</Typography>
            </Button>
            <Dialog
                size="xs"
                open={openStock}
                handler={handleCloseStock}
                className="bg-transparent shadow-none"
            >
                <Card shadow={false} className="mx-auto w-full">
                    <CardBody className="flex flex-col items-center justify-center">
                        <Typography variant="h4" color="blue-gray">
                            Add New Stock
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal text-center">
                            Nice to meet you! Please enter the new stock data you want to add.
                        </Typography>
                        <Formik
                            initialValues={{ 
                                WarehouseId: '',
                                ProductId: '',
                                stock: ''
                            }}
                            validationSchema={StockSchema}
                            onSubmit={(values, action) => {
                                handleSubmit(values)
                                action.resetForm()
                            }}
                        >
                            {({setFieldValue}) => (
                                <Form className="mt-8 w-full">
                                    <div className="flex flex-col gap-6">
                                        <FormWarehouseList setFieldValue={setFieldValue} />
                                        <FormProductList setFieldValue={setFieldValue} />
                                        <FormStock />
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