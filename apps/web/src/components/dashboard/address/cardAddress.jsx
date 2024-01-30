export function CardAddress() {
    return (
        <Card>
            <CardBody className="h-64 flex flex-col gap-2 lg:h-52">
                <div className="flex items-center gap-2">
                    <FaLocationDot fontSize={'25px'} />
                    <Typography variant="h5">
                        {label}
                    </Typography>
                </div>
                <div className="flex gap-2">
                    <Typography variant="h6">
                        Province : 
                    </Typography>
                    <Typography variant="paragraph">
                        {province}
                    </Typography>
                </div>
                <div className="flex gap-2">
                    <Typography variant="h6">
                        City : 
                    </Typography>
                    <Typography variant="paragraph">
                        {city}
                    </Typography>
                </div>
                <Typography variant="paragraph" className="line-clamp-2 lg:line-clamp-1"> 
                    {address}
                </Typography>
                <div className="flex gap-2">
                    <Typography variant="small" className="w-20"> 
                        Note :
                    </Typography>
                    <Typography variant="small" className="line-clamp-2 lg:line-clamp-1"> 
                        {note}
                    </Typography>
                </div>
            </CardBody>
            <CardFooter>
                <Button className="w-full">
                    Change Address
                </Button>
            </CardFooter>
        </Card>
    )
}