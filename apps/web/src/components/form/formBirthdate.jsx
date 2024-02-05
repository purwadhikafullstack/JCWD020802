import { Typography } from "@material-tailwind/react"
import { ErrorMessage, Field } from "formik"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select';
import { setSelectedDay, setSelectedMonth, setSelectedYear } from "../../redux/userSlice";

export function FormBirthdate ({ setFieldValue }) {
    const selectedDay = useSelector((state) => state.user.dayValue);
    const selectedMonth = useSelector((state) => state.user.monthValue);
    const selectedYear = useSelector((state) => state.user.yearValue);
    const dispatch = useDispatch()

    const isLeapYear = (year) => {
        if (year % 4 === 0) {
            if (year % 100 !== 0 || (year % 100 === 0 && year % 400 === 0)) {
                return true;
            }
        } return false;
    }

    const dayLength = selectedMonth?.id == 2 && selectedMonth?.id % 2 == 0 ? isLeapYear(selectedYear?.value) || selectedYear?.value == null ? 29 : 28 : 31

    const currentYear = new Date().getFullYear() - 10

    const days = Array.from({ length: dayLength }, (_, i) => (i + 1).toString());
    const months = [
        { id: 1, name: 'January' },
        { id: 2, name: 'February' },
        { id: 3, name: 'March' },
        { id: 4, name: 'April' },
        { id: 5, name: 'May' },
        { id: 6, name: 'June' },
        { id: 7, name: 'July' },
        { id: 8, name: 'August' },
        { id: 9, name: 'September' },
        { id: 10, name: 'October' },
        { id: 11, name: 'November' },
        { id: 12, name: 'December' }
    ]

    const allYears = Array.from({ length: 75 }, (_, i) => (currentYear - i).toString());

    const leapYears = allYears.filter((year) => {
       return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    });

    const years = selectedMonth?.id == 2 && selectedDay?.value == 29 ? leapYears : allYears

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderColor: 'gray',
            borderWidth: state.isFocused ? '2px' : '1px',
            boxShadow: 'green',
            '&:hover': {
                borderColor: 'green',
            }
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: 'white',
            '&:hover': {
                backgroundColor: 'lightgreen',
            }
        })
    };

    return (
        <div>
            <Typography variant="h6" color="blue-gray" className="mb-1">
                Birthdate
            </Typography>
            <div className="flex flex-col items-center justify-center w-full gap-5 lg:flex-row">
                <div className="flex flex-col w-full lg:w-32">
                    <Typography variant="h6" color="blue-gray" className="mb-2 text-sm">
                        Day
                    </Typography>
                    <Field
                        as={Select}
                        name="day"
                        styles={customStyles}
                        options={days.map((day) => ({ label: day, value: day }))}
                        onChange={(selectedOption) => {
                            dispatch(setSelectedDay(selectedOption))
                            setFieldValue("day", selectedOption.value)
                        }}
                        value={selectedDay}
                        isSearchable
                        isClearable
                    />
                    <ErrorMessage
                        component="FormControl"
                        name="day"
                        style={{ color: "red" }}
                    />
                </div>
                <div className="flex flex-col w-full lg:w-52">
                    <Typography variant="h6" color="blue-gray" className="mb-2 text-sm">
                        Month
                    </Typography>
                    <Field
                        as={Select}
                        name="month"
                        styles={customStyles}
                        options={months.map((month) => ({ label: month.name, value: month.name, id: month.id }))}
                        onChange={(selectedOption) => {
                            dispatch(setSelectedMonth(selectedOption))
                            setFieldValue("month", selectedOption.value)
                        }}
                        value={selectedMonth}
                        isSearchable
                        isClearable
                    />
                    <ErrorMessage
                        component="FormControl"
                        name="month"
                        style={{ color: "red" }}
                    />
                </div>
                <div className="flex flex-col w-full lg:w-40">
                    <Typography variant="h6" color="blue-gray" className="mb-2 text-sm">
                        Year
                    </Typography>
                    <Field
                        as={Select}
                        name="year"
                        styles={customStyles}
                        options={years.map((year) => ({ label: year, value: year }))}
                        onChange={(selectedOption) => {
                            dispatch(setSelectedYear(selectedOption))
                            setFieldValue("year", selectedOption.value)
                        }}
                        value={selectedYear}
                        isSearchable
                        isClearable
                    />
                    <ErrorMessage
                        component="FormControl"
                        name="year"
                        style={{ color: "red" }}
                    />
                </div>
            </div>
        </div>
    )
}