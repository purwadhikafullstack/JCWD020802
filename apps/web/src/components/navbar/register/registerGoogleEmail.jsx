import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Typography } from "@material-tailwind/react";
import { useEffect, useState } from 'react'
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { Axios } from "../../../lib/api";
 
export function RegisterGoogle () {
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
            console.log(error);
        }
    }
    
    const registerGoogleUser = async () => {
        try {
            await Axios.post(
                `users/register-google-user?fullname=${googleUser?.displayName}&email=${googleUser?.email}`, {}
            )
            await signOut(auth)
            toast.success('Register Success!')
        } catch (error) {
            console.error(error);
            await signOut(auth)
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
                Register your Google account
            </Button>
        </div>
    );
}