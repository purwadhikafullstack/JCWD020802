import { Radio, Typography } from "@material-tailwind/react";
import { ErrorMessage, Field } from "formik";
import { FaFemale, FaMale } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedGender } from "../../redux/userSlice";

export function FormGender () {
    const dispatch = useDispatch()
    const selectedGender = useSelector((state) => state.user.genderValue);

    const handleGenderChange = (value) => {
        dispatch(setSelectedGender(value))
    }

    return (
        <div className="flex flex-col">
            <Typography variant="h6" color="blue-gray" className="mb-2">
                Gender
            </Typography>
            <div role="group" className="flex flex-col gap-4 sm:gap-8 sm:items-center sm:justify-center sm:flex-row" >
                <label className="flex items-center lg:justify-center">
                    <Field 
                        as={Radio}
                        color="green"
                        ripple={true}
                        name="gender"
                        value="Male"
                        checked={selectedGender === "Male"}
                        onClick={() => handleGenderChange("Male")}
                    />
                    <FaMale fontSize={'35px'} color="blue"/>
                    <Typography variant="lead">Male</Typography>
                </label>
                <label className="flex items-center lg:justify-center">
                    <Field
                        as={Radio}
                        color="green"
                        ripple={true}
                        name="gender"
                        value="Female"
                        checked={selectedGender === "Female"}
                        onClick={() => handleGenderChange("Female")}
                    />
                    <FaFemale fontSize={'35px'} color="red"/>
                    <Typography variant="lead">Female</Typography>
                </label>
                <ErrorMessage
                    component="FormControl"
                    name="gender"
                    style={{ color: "red"}}
                />
            </div>
        </div>
    )
}