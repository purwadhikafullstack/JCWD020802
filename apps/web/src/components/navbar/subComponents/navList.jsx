import { Typography } from "@material-tailwind/react"

export function NavList() {
    const buttonList = [
        {name: 'Home', path: '/'},
        {name: 'Products', path: '/products'},
        {name: 'Categories', path: '/categories'}
    ]

    return (
        <div className="mr-4 hidden lg:block">
            <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
                {buttonList.map((item) => (
                    <Typography
                        as="li"
                        variant="small"
                        color="blue-gray"
                        className="p-1 font-normal"
                    >
                        <a href={item.path} className="flex items-center">{item.name}</a>
                    </Typography>
                ))}
            </ul>
        </div>
    )
}