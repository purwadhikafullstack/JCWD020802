import { Option, Select } from "@material-tailwind/react";

export function FilterByGender({ setGenderFilter, setCurrentPage }) {
    const genderOptions = [
        { label: "All", value: "" },
        { label: "Male", value: "Male" },
        { label: "Female", value: "Female" },
    ];

    const handleGenderFilter = (value) => {
        setGenderFilter(value);
        setCurrentPage(1);
    };

    return (
        <Select
            onChange={handleGenderFilter}
            label="Gender"
            color="green"
        >
            {genderOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                    {option.label}
                </Option>
            ))}
        </Select>
    );
}