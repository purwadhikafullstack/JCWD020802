import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Typography } from "@material-tailwind/react";
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { Axios } from "../../../lib/api";
import { setData } from "../../../redux/userSlice";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 
export function LoginGoogle () {
    const [googleUser, setGoogleUser] = useState({})
    const [isGoogleButtonClicked, setIsGoogleButtonClicked] = useState(false);
    const dispatch = useDispatch();

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
    
    const checkGoogleUser = async () => {
        try {
            const response = await Axios.get(`users/check-email?email=${googleUser.email}`)
            if (response.data) {
                dispatch(setData(response.data));
                localStorage.setItem("token", googleUser?.accessToken);
                await signOut(auth)
                toast.success('Login Success!')
                window.location.reload()
            } else {
                toast.error('Account not found!')
            }
        } catch (error) {
            console.log(error);
            await signOut(auth)
            toast.error('Login Failed!')
        }
    }

    const handleGoogleSignOut = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (isGoogleButtonClicked) {
            checkGoogleUser();
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
                Log In with Google
            </Button>
        </div>
    );
}