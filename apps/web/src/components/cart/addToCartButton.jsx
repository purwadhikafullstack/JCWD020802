import { Button, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { Axios } from "../../lib/api";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { BiSolidCartAdd } from "react-icons/bi";
import { setQuantity } from "../../redux/cartSlice";

export function AddToCartButton({ product }) {
    const token = localStorage.getItem("token");
    const user = useSelector((state) => state.user.value);
    const quantity = useSelector((state) => state.cart.quantityValue)
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()


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
            let updatedQuantity = quantity + 1
            dispatch(setQuantity(updatedQuantity))
            toast.success("Item added to cart");
        } catch (error) {
            if (error.response.status == 400) {
                toast.error('Please Login to your account first!')
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
            onClick={() => handleAddToCart(product.id)}
            disabled={isLoading}
            color="green"
            className="px-0 h-10 w-full flex items-center justify-center"
        >
            {
                isLoading ? 
                <ClipLoader size={15} color={"#fff"} loading={isLoading} /> :
                <div className="flex items-center justify-center gap-2">
                    <BiSolidCartAdd color="white" fontSize={'20px'} />
                    <Typography variant="h6" className="text-xs">
                        Add to Cart
                    </Typography>
                </div> 
            }
        </Button>
    )
}