import { Input, Typography } from "@material-tailwind/react";
import { ErrorMessage, Field } from "formik";

export function FormAddressNote() {
    return (
        <div className="flex flex-col">
            <Typography variant="h6" color="blue-gray" className="mb-1">
                Note (optional)
            </Typography>
            <Field
                as={Input}
                name="note"
                className=" !border-t-blue-gray-200 focus:!border-green-500"
                labelProps={{ className: "before:content-none after:content-none" }}
            />
            <ErrorMessage
                component="FormControl"
                name="note"
                style={{ color: "red"}}
            />
        </div>
    )
}