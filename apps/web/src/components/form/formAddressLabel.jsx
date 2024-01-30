import { Input, Typography } from "@material-tailwind/react";
import { ErrorMessage, Field } from "formik";

export function FormAddressLabel() {
    return (
        <div className="flex flex-col">
            <Typography variant="h6" color="blue-gray" className="mb-2">
                Label
            </Typography>
            <Field
                as={Input}
                name="label"
                className="!border-t-blue-gray-200 focus:!border-green-500"
                labelProps={{ className: "before:content-none after:content-none" }}
            />
            <ErrorMessage
                component="FormControl"
                name="label"
                style={{ color: "red"}}
            />
        </div>
    )
}