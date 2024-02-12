import { Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { Axios } from "../../lib/api";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";

export function ChangeProfilePicture({ onUserUpdate }) {
    const user = useSelector((state) => state.user.value)
    let token = localStorage.getItem("token");
    if (user.role !== 'Customer') {
        token = localStorage.getItem("adminToken");
    }
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false)

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        try {
            if (file) {
                setUploading(true)
    
                const formData = new FormData();
                formData.append("file", file);
    
                await Axios.patch("edits/profile-picture", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                    },
                });
                toast.success('Profile picture successfully changed');
                onUserUpdate()
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed changing profile picture!');
        } finally {
            setUploading(false)
        }
    };

    useEffect(() => {
        handleUpload()
    }, [file])

    return (
        <div className="relative w-full">
            {
                uploading ?
                <ClipLoader size={20} color="green" loading={uploading} className="flex items-center justify-center" /> : 
                <label for="profileImg" className="cursor-pointer bg-green-600 hover:bg-green-300 text-white py-3 text-center rounded-lg inline-block w-full">
                    <Typography variant="h6" className="text-xs">
                        CHANGE PICTURE
                    </Typography>
                </label>
            }
            <input id="profileImg" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>
    )
}