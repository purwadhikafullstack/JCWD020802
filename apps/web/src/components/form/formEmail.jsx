import { Input, Typography } from "@material-tailwind/react";
import { ErrorMessage, Field } from "formik";

export function FormEmail() {
    return (
        <div className="flex flex-col">
            <Typography variant="h6" color="blue-gray" className="mb-2">
                Email
            </Typography>
            <Field
                as={Input}
                name="email"
                className=" !border-t-blue-gray-200 focus:!border-green-500"
                labelProps={{
                    className: "before:content-none after:content-none",
                }}
            />
            <ErrorMessage
                component="FormControl"
                name="email"
                style={{ color: "red"}}
            />
        </div>
    )
}