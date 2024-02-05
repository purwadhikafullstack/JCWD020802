import { Textarea, Typography } from "@material-tailwind/react";
import { ErrorMessage, Field } from "formik";

export function FormAddress() {
    return (
        <div className="flex flex-col">
            <Typography variant="h6" color="blue-gray" className="mb-1">
                Full Address
            </Typography>
            <Field
                as={Textarea}
                name="address"
                placeholder="Enter full address..."
                className="!border-t-blue-gray-200 focus:!border-green-500"
                labelProps={{ className: "before:content-none after:content-none" }}
            />
            <ErrorMessage
                component="FormControl"
                name="address"
                style={{ color: "red"}}
            />
        </div>
    )
}