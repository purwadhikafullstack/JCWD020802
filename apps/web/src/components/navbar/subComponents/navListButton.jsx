import { Button, Typography } from "@material-tailwind/react"

export function NavList() {
    return (
        <Button 
            variant="text"
            size="sm"
        >
            <Typography
                variant="small"
                color="green"
                className="font-bold"
            >
                <a href='/products' className="flex items-center">Products</a>
            </Typography>
        </Button>
    )
}