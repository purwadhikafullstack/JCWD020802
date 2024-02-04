import { IconButton, Input, Typography } from "@material-tailwind/react"
import { ErrorMessage, Field } from "formik"
import { useState } from "react"
import { BiSolidHide, BiSolidShow } from "react-icons/bi"

export function FormPassword({ label, keyName }) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="flex flex-col">
            <Typography variant="h6" color="blue-gray" className="mb-2">
                {label}
            </Typography>
            <div className="flex">
                <Field
                    as={Input}
                    name={keyName}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    className="!border-t-blue-gray-200 focus:!border-green-500"
                    labelProps={{
                        className: "before:content-none after:content-none",
                    }}
                />
                <IconButton variant="text" className="h-10 ml-1 flex items-center justify-center" onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <BiSolidShow fontSize={"30px"}/> : <BiSolidHide fontSize={"30px"}/>}
                </IconButton>
            </div>
            <ErrorMessage
                component="FormControl"
                name={keyName}
                style={{ color: "red"}}
            />
        </div>
    )
}