import { Button, Typography } from "@material-tailwind/react"
import { useNavigate } from "react-router-dom"

export function NavList() {
    const buttonList = [
        {name: 'Home', path: '/'},
        {name: 'Products', path: '/products'},
        {name: 'Categories', path: '/categories'}
    ]

    return (
            <ul className="mt-2 mb-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
                {buttonList.map((item) => (
                    <Button 
                        variant="text"
                        size="sm"
                    >
                        <Typography
                            as="li"
                            variant="small"
                            color="brown"
                            className="font-normal"
                        >
                            <a href={item.path} className="flex items-center">{item.name}</a>
                        </Typography>
                    </Button>
                ))}
            </ul>
    )
}