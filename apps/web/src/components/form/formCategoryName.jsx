import { Input, Typography } from "@material-tailwind/react";
import { ErrorMessage, Field } from "formik";

export function FormCategoryName() {
    return (
        <div className="flex flex-col">
            <Typography variant="h6" color="blue-gray" className="mb-2">
                Category
            </Typography>
            <Field
                as={Input}
                name="categoryName"
                placeholder="Write the new category..."
                className="!border-t-blue-gray-200 focus:!border-green-500"
                labelProps={{
                    className: "before:content-none after:content-none",
                }}
            />
            <ErrorMessage
                component="FormControl"
                name="categoryName"
                style={{ color: "red"}}
            />
        </div>
    )
}