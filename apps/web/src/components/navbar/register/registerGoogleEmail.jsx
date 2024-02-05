import { Button } from "@material-tailwind/react";
import { useEffect, useState } from 'react'
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { Axios } from "../../../lib/api";
import { toast } from 'react-toastify';
 
export function RegisterGoogle ({ handleOpenRegister }) {
    const [googleUser, setGoogleUser] = useState({})
    const [isGoogleButtonClicked, setIsGoogleButtonClicked] = useState(false);

    onAuthStateChanged(auth, (userLogin) => {
        setGoogleUser(userLogin)
    })

    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            setIsGoogleButtonClicked(true);
        } catch (error) {
            toast.error('Failed to login to your Google account!')
        }
    }
    
    const registerGoogleUser = async () => {
        try {
            await Axios.post(
                `users/register-google-user?fullname=${googleUser?.displayName}&email=${googleUser?.email}`, {}
            )
            await signOut(auth)
            handleOpenRegister()
            toast.success('Register Success!')
            toast.success('Please try to login with Google account!')
        } catch (error) {
            await signOut(auth)
            handleOpenRegister()
            toast.error('Email is already exist!')
        }
    }

    useEffect(() => {
        if (isGoogleButtonClicked) {
            registerGoogleUser();
        }
    }, [isGoogleButtonClicked]);

    return (
        <div className="mx-auto w-full">
            <Button
                size="lg"
                variant="outlined"
                color="blue-gray"
                fullWidth
                className="flex items-center justify-center gap-3"
                onClick={handleGoogleSignIn}
            >
                <img src="https://docs.material-tailwind.com/icons/google.svg" alt="metamask" className="h-6 w-6" />
                Register Google account
            </Button>
        </div>
    );
}