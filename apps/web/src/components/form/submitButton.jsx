import { Button } from "@material-tailwind/react";
import { ClipLoader } from "react-spinners";

export function SubmitButton({ isLoading, buttonName }) {
    return (
        <Button
            type='submit'
            size="lg"
            fullWidth
            className="bg-green-600 hover:bg-green-300" 
            disabled={isLoading}
        >
            {
                isLoading ? 
                <ClipLoader size={20} color={"#fff"} loading={isLoading} /> : 
                buttonName
            }
        </Button>
    )
}