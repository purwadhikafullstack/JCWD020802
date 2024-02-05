import { Textarea, Typography } from "@material-tailwind/react";
import { ErrorMessage, Field } from "formik";

export function FormProductDetail() {
    return (
        <div className="flex flex-col">
            <Typography variant="h6" color="blue-gray" className="mb-2">
                Product Detail
            </Typography>
            <Field
                as={Textarea}
                name="productDetail"
                placeholder="Product detail..."
                className="!border-t-blue-gray-200 focus:!border-green-500"
                labelProps={{
                    className: "before:content-none after:content-none",
                }}
            />
            <ErrorMessage
                component="FormControl"
                name="productDetail"
                style={{ color: "red"}}
            />
        </div>
    )
}