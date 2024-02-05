import { Input } from "@material-tailwind/react";

export function Search({ searchTerm, setSearchTerm, setCurrentPage }) {
    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    }

    return (
        <Input
            type="text"
            label="Search"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            color="green"
            className="p-2 rounded-md"
        />
    )
}