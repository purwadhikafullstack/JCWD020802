import { Avatar, Card, CardHeader, Typography } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { EditFullname } from "../edit/editFullname";
import { EditBirthdate } from "../edit/editBirthdate";
import { EditGender } from "../edit/editGender";
import { EditEmail } from "../edit/editEmail";
import NullPhotoProfile from "../../assets/null-profile-picture.png";
import { useEffect, useState } from "react";
import { Axios } from "../../lib/api";
import { setData } from "../../redux/userSlice";
import { ChangePassword } from "../edit/changePassword";
import { ChangeProfilePicture } from "../edit/changeProfilePicture";

export function MyProfile() {
    const user = useSelector((state) => state.user.value);
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();
    const [userUpdate, setUserUpdate] = useState(false)

    const handleUserUpdate = () => {
        setUserUpdate(true)
    }

    const fetchData = async () => {
        try {
            if (userUpdate) {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                }
                const response = await Axios.get(`users/${user.id}`, config)
                dispatch(setData(response.data))
            }
        } catch (error) {
            console.error("Error fetching updated user data:", error);
        } finally {
            setUserUpdate(false)
        }
    }

    const tableData = [
        {
            label: 'Fullname',
            data: user.fullname,
            edit: <EditFullname onUserUpdate={handleUserUpdate} />
        },
        {
            label: 'Birthdate',
            data: user.birthdate,
            edit: <EditBirthdate onUserUpdate={handleUserUpdate} />
        },
        {
            label: 'Gender',
            data: user.gender,
            edit: <EditGender onUserUpdate={handleUserUpdate} />
        },
        {
            label: 'Email',
            data: user.email,
            edit: <EditEmail onUserUpdate={handleUserUpdate} />
        }
    ]

    useEffect(() => {
        fetchData()
    }, [userUpdate])

    return(
        <div className="flex justify-center h-full">
            <Card className="w-full flex flex-col justify-center gap-2 mx-2 p-3 border-solid border-brown-500 border-2 lg:flex-row lg:mx-96">
                <div className="flex flex-col w-full items-center gap-2 lg:w-96">
                    <Card className="flex flex-col w-full px-5 items-center gap-2 py-2 border-solid border-brown-500 border-2 lg:w-72">
                        {
                            user.photoProfile == null || user.photoProfile == '' ?
                            <Avatar src={NullPhotoProfile} alt="photo profile" style={{ width: '250px', height: '250px' }}  />:
                            <Avatar src={`http://localhost:8000/${user.photoProfile}`} alt="photo profile" style={{ width: '250px', height: '250px' }} />
                        }
                        <ChangeProfilePicture onUserUpdate={handleUserUpdate} />
                        <Typography variant="small" fullWidth className="text-justify" color="black">
                            Maximum file size 1 MB. Allowed file extension are .jpg, .jpeg, .png
                        </Typography>
                    </Card>
                    <ChangePassword onUserUpdate={handleUserUpdate} />
                </div>
                <Card className="w-full overflow-scroll border-solid border-brown-500 border-2">
                    <CardHeader floated={false} shadow={false} className="rounded-none mb-5">
                        <Typography variant="h5" color="blue-gray">
                            Edit Profile
                        </Typography>
                    </CardHeader>
                    <table className="w-full table-auto">
                        <tbody>
                            {tableData.map((item) => (
                                <tr key={item.label}>
                                    <th className="w-20 px-4 text-left">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-bold"
                                        >
                                            {item.label}
                                        </Typography>
                                    </th>
                                    <td className="text-center">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-bold"
                                        >
                                            :
                                        </Typography>
                                    </td>
                                    <td>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal mx-1"
                                        >
                                            {item.data}
                                        </Typography>
                                    </td>
                                    <td className="w-20 py-2 flex items-center justify-center">
                                        {item.edit}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </Card>
        </div>
    )
}
