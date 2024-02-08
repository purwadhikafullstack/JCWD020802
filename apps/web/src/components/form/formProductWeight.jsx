import { Input, Typography } from "@material-tailwind/react";
import { ErrorMessage, Field } from "formik";

export function FormProductWeight() {
    return (
        <div className="flex flex-col">
            <Typography variant="h6" color="blue-gray" className="mb-2">
                Product Weight
            </Typography>
            <div className="flex items-center gap-1">
                <Field
                    as={Input}
                    name="productWeight"
                    placeholder="Product weight in grams..."
                    className="!border-t-blue-gray-200 focus:!border-green-500"
                    labelProps={{
                        className: "before:content-none after:content-none",
                    }}
                />
                <ErrorMessage
                    component="FormControl"
                    name="productWeight"
                    style={{ color: "red"}}
                />
                <Typography variant="h6" color="blue-gray">
                    grams
                </Typography>
            </div>
        </div>
    )
}