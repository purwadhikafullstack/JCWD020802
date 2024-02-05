import { Input, Typography } from "@material-tailwind/react";
import { ErrorMessage, Field } from "formik";

export function FormStock() {
    return (
        <div className="flex flex-col">
            <Typography variant="h6" color="blue-gray" className="mb-2">
                Stock
            </Typography>
            <Field
                as={Input}
                name="stock"
                placeholder="Enter the stock number..."
                className="!border-t-blue-gray-200 focus:!border-green-500"
                labelProps={{
                    className: "before:content-none after:content-none",
                }}
            />
            <ErrorMessage
                component="FormControl"
                name="stock"
                style={{ color: "red"}}
            />
        </div>
    )
}