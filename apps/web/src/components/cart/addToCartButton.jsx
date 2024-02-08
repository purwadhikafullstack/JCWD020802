import { Button } from "@material-tailwind/react";
import { useState } from "react";
import { Axios } from "../../lib/api";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

export function AddToCartButton({ product }) {
    const token = localStorage.getItem("token");
    const user = useSelector((state) => state.user.value);
    const [isLoading, setIsLoading] = useState(false);

    const handleAddToCart = async () => {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        }

        const data = {
            quantity: 1,
            UserId: user.id,
            ProductId: product.id
        }

        try {
            setIsLoading(true)
            await Axios.post("carts/add", data, config)
            toast.success("Item added to cart");
        } catch (error) {
            if (error.response.status == 400) {
                toast.error('Error Token')
            } else if (error.response.status == 401) {
                toast.error('Unauthorize (Super Admin only)!')
            } else {
                toast.error("Failed to add item to cart");
            } 
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <Button
            ripple={false}
            fullWidth
            onClick={() => handleAddToCart(product.id)}
            disabled={isLoading}
            className="bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
        >
            {
                isLoading ? 
                <ClipLoader size={15} color={"#fff"} loading={isLoading} /> : 
                "Add to Cart"
            }
        </Button>
    )
}