import { useEffect, useState } from "react";
import { Axios } from "../lib/api";
import { DialogAddress } from "./dashboard/address/dialogAddress";
import { useSelector } from "react-redux";
import { Button, Card, CardBody, CardFooter, Typography } from "@material-tailwind/react";
import { FaLocationDot, FaStar } from "react-icons/fa6";

export function ManageAddress() {
    const user = useSelector((state) => state.user.value);
    const token = localStorage.getItem('token');
    const [addressList, setAddressList] = useState([])

    const customerAddress = async () => {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        }
        try {
            const response = await Axios.get(`addresses/customer/${user.id}`, config)
            setAddressList(response.data)
        } catch (error) {
            console.log(error);
            alert("Failed getting customer address data!")
        }
    }

    useEffect(() => {
        customerAddress();
    }, [user.id, token]);

    return (
        <div className="flex flex-col gap-5">
            <DialogAddress />
            {addressList.map((item) => 
                <Card key={item.id} className={`border-solid border-2 ${item.isMain ? "border-green-600" : "border-brown-500"}`}>
                    <CardBody className="h-64 flex flex-col gap-2 lg:h-52">
                        <div className="flex items-center gap-2">
                            <FaLocationDot fontSize={'25px'} color={item.isMain ? "green" : "brown"}/>
                            <Typography variant="h5" className="">
                                {item.label}
                            </Typography>
                        </div>
                        <div className="flex gap-2">
                            <Typography variant="h6">
                                Province : 
                            </Typography>
                            <Typography variant="paragraph">
                                {item.City.Province.province}
                            </Typography>
                        </div>
                        <div className="flex gap-2">
                            <Typography variant="h6">
                                City : 
                            </Typography>
                            <Typography variant="paragraph">
                                {item.City.city_name}
                            </Typography>
                        </div>
                        <Typography variant="paragraph" className="line-clamp-2 lg:line-clamp-1"> 
                            {item.address}
                        </Typography>
                        <div className="flex">
                            <Typography variant="small" className="w-12"> 
                                Note :
                            </Typography>
                            <Typography variant="small" className="line-clamp-2 lg:line-clamp-1"> 
                                {item.note == '' ? 'No Note' : item.note}
                            </Typography>
                        </div>
                    </CardBody>
                    <CardFooter>
                        <Button className="w-full bg-green-600 hover:bg-green-300">
                            Change Address
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    )
}
