import { Option, Select } from "@material-tailwind/react";

export function FilterByRole({ setRoleFilter, setCurrentPage }) {
    const roleOptions = [
        { label: "All", value: "" },
        { label: "Warehouse Admin", value: "Warehouse Admin" },
        { label: "Customer", value: "Customer" }
    ];

    const handleRoleFilter = (value) => {
        setRoleFilter(value);
        setCurrentPage(1);
    };

    return (
        <Select
            onChange={handleRoleFilter}
            label="Role"
            color="green"
        >
            {roleOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                    {option.label}
                </Option>
            ))}
        </Select>
    );
}