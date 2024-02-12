import { Button, Typography } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { Axios } from "../../lib/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function ProductCategories() {
    const [categoryLists, setCategoryLists] = useState([])
    const navigate = useNavigate()
    const getCategories = async () => {
        try {
            const response = await Axios.get('categories/')
            console.log(response);
            setCategoryLists(response.data)
            toast.success('Success getting categories data!')
        } catch (error) {
            toast.error('Failed to get categories!');
        }
    }
    
    useEffect(() => {
        getCategories()
    }, [])

    return (
        <div>
            <div class="flex items-center py-4 md:py-8 flex-wrap">
                <Typography variant="h3" >Categories</Typography>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categoryLists.map((item) => (
                    <div className="relative w-full">
                        <Button className="bg-white" onClick={() => navigate(`/products/${item.categoryName}`)}>
                            <img class="h-auto max-w-full rounded-lg" src={`${import.meta.env.VITE_LOCAL_HOST}${item.categoryPicture}`} alt="" />
                            <figcaption className="absolute bottom-3 w-3/4 justify-between rounded-r-xl border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
                                <Typography variant="h5" color="blue-gray">
                                    {item.categoryName}
                                </Typography>
                            </figcaption>
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}