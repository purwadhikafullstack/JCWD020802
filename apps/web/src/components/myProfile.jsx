import { Avatar, Button, Card, CardHeader, Input, Typography } from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { EditFullname } from "./edit/editFullname";
import { EditBirthdate } from "./edit/editBirthdate";
import { EditGender } from "./edit/editGender";
import { EditEmail } from "./edit/editEmail";
import NullPhotoProfile from "../assets/null-profile-picture.png";
import { useState } from "react";
import { Axios } from "../lib/api";

export function MyProfile() {
    const user = useSelector((state) => state.user.value);
    const token = localStorage.getItem("token");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false)

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        try {
            setUploading(true)

            const formData = new FormData();
            formData.append("file", file);

            await Axios.patch("edits/profile-picture", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                },
            });
            alert("Profile picture successfully changed");
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Error changing profile picture");
        } finally {
            setUploading(false)
        }
    };

    const tableData = [
        {
            label: 'Fullname',
            data: user.fullname,
            edit: <EditFullname />
        },
        {
            label: 'Birthdate',
            data: '26-02-1997',
            edit: <EditBirthdate />      // ADD BIRTHDATE IN DATABASE! (Reminder)
        },
        {
            label: 'Gender',
            data: user.gender,
            edit: <EditGender />
        },
        {
            label: 'Email',
            data: user.email,
            edit: <EditEmail />
        }
    ]

    console.log(user);

    return(
        <div className="flex justify-center">
            <Card className="w-fit flex flex-row justify-center gap-2 my-5 mx-2 p-3 border-solid border-green-600 border-2">
                <div className="flex flex-col items-center gap-2">
                    <Card className="flex flex-col w-80 mx-auto items-center gap-2 py-2 border-solid border-green-600 border-2">
                        {
                            user.photoProfile == null ?
                            <Avatar src={NullPhotoProfile} alt="photo profile" style={{ width: '250px', height: '250px' }}  />:
                            <Avatar src={`http://localhost:8000/${user.photoProfile}`} alt="photo profile" style={{ width: '250px', height: '250px' }} />
                        }
                        <Input type="file" accept="image/*" onChange={handleFileChange} />
                        <Button className="w-60" color="brown" onClick={handleUpload} disabled={uploading}>
                            {uploading ? "Uploading..." : "Change Profile Picture"}
                        </Button>
                        <Typography variant="small" className="text-justify px-10">
                            Maximum file size 1 MB. Allowed file extension are .jpg, .jpeg, .png
                        </Typography>
                    </Card>
                    <Button className="w-80" color="brown">
                        Change Password
                    </Button>
                </div>
                <Card className="w-96 overflow-scroll border-solid border-green-600 border-2">
                    <CardHeader floated={false} shadow={false} className="rounded-none mb-1">
                        <Typography variant="h5" color="blue-gray">
                            Edit Profile
                        </Typography>
                    </CardHeader>
                    <table className="min-w-max table-auto text-left">
                        <tbody>
                            {tableData.map((item) => (
                                <tr key={item.label}>
                                    <th className="pl-4 py-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-bold"
                                        >
                                            {item.label}
                                        </Typography>
                                    </th><td className="py-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            :
                                        </Typography>
                                    </td>
                                    <td className="py-4 px-2">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {item.data}
                                        </Typography>
                                    </td>
                                    <td className="pr-1">
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
