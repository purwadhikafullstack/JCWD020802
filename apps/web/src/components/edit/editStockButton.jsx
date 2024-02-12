import { Card, Typography, CardBody, Dialog, } from "@material-tailwind/react";
import { useState } from 'react'
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Axios } from "../../lib/api";
import { toast } from 'react-toastify';
import { SubmitButton } from "../form/submitButton";
import { EditButton } from "./editButton";
import { useDispatch } from "react-redux";
import { setSelectedProduct, setSelectedWarehouse } from "../../redux/stockSlice";
import { FormWarehouseList } from "../form/formWarehouseList";
import { FormProductList } from "../form/formProductList";
import { FormStock } from "../form/formStock";

const StockSchema = Yup.object().shape({
    WarehouseId: Yup.string().required("Warehouse is required"),
    ProductId: Yup.string().required("Product is required"),
    stock: Yup.number()
        .integer("Stock must a number")
        .positive("Stock must in positive number")
})
 
export function EditStockButton({ stock, handleStockUpdate }) {
    const adminToken = localStorage.getItem('adminToken');
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()
 
    const handleOpen = (stock) => {
        dispatch(setSelectedWarehouse({label: stock.Warehouse.label, value: stock.WarehouseId}))
        dispatch(setSelectedProduct({label: stock.Product.productName, value: stock.ProductId}))
        setOpen(true);
    };

    const handleClose = () => {
        dispatch(setSelectedWarehouse(null))
        dispatch(setSelectedProduct(null))
        setOpen(false);
    };

    const handleSubmit = async (data) => {
        const config = {
            headers: { Authorization: `Bearer ${adminToken}` }
        }
        try {
            setIsLoading(true)
            await Axios.post(`stocks/edit/${stock.id}`, data, config);
            handleClose()
            handleStockUpdate()
            toast.success('Stock successfully updated!');
        } catch (error) {
            handleClose()
            toast.error('Failed to update Stock!');
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <>
            <EditButton tooltip={"Edit Stock"} handleOpen={() => handleOpen(stock)}/>
            <Dialog size="xs" open={open} handler={handleClose}>
                <Card shadow={false} className="mx-auto w-full">
                    <CardBody className="flex flex-col items-center justify-center">
                        <Typography variant="h4" color="blue-gray">
                            Edit Stock
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            Change selected stock
                        </Typography>
                        <Formik
                            initialValues={{ 
                                WarehouseId: stock.WarehouseId,
                                ProductId: stock.ProductId,
                                stock: stock.stock
                            }}
                            validationSchema={StockSchema}
                            onSubmit={(values, action) => {
                                handleSubmit(values)
                                action.resetForm()
                            }}
                        >
                            {({setFieldValue}) => (
                                <Form className="mt-8 w-full sm:w-96">
                                    <div className="flex flex-col gap-5">
                                        <FormWarehouseList setFieldValue={setFieldValue} />
                                        <FormProductList setFieldValue={setFieldValue} />
                                        <FormStock />
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