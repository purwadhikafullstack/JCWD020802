import { useState } from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
 
export function PaginationButton({ currentPage, setCurrentPage, totalPages }) {
    const getItemProps = (index) => ({
        variant: currentPage === index ? "filled" : "text",
        color: "green",
        onClick: () => setCurrentPage(index),
        className: "rounded-full font-bold",
    });

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };
    
    return (
        <div className="flex items-center gap-4">
            <Button
                variant="text"
                className="flex items-center gap-2 rounded-full"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <FaArrowLeft strokeWidth={2} className="h-4 w-4" />
                Previous
            </Button>
            <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, index) => (
                    <IconButton key={index} {...getItemProps(index + 1)}>
                        {index + 1}
                    </IconButton>
                ))}
            </div>
            <Button
                variant="text"
                className="flex items-center gap-2 rounded-full"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
                <FaArrowRight strokeWidth={2} className="h-4 w-4" />
            </Button>
        </div>
    );
}