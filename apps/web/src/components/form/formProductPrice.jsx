import { Input, Typography } from "@material-tailwind/react";
import { ErrorMessage, Field } from "formik";

export function FormProductPrice() {
    return (
        <div className="flex flex-col">
            <Typography variant="h6" color="blue-gray" className="mb-2">
                Product Price
            </Typography>
            <div className="flex items-center gap-1">
                <Typography variant="h6" color="blue-gray">
                    Rp.
                </Typography>
                <Field
                    as={Input}
                    name="productPrice"
                    placeholder="Product price in rupiah (IDR)..."
                    className="!border-t-blue-gray-200 focus:!border-green-500"
                    labelProps={{
                        className: "before:content-none after:content-none",
                    }}
                />
                <ErrorMessage
                    component="FormControl"
                    name="productPrice"
                    style={{ color: "red"}}
                />
            </div>
        </div>
    )
}