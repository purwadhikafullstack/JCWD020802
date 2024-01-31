import React, { useEffect } from 'react';
import { Button, Card, Typography } from '@material-tailwind/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Axios } from "../../lib/api";

export function NewEmailVerification () {
    const params = useParams()
    const navigate = useNavigate()

    const handleVerification = async () => {
        const config = {
            headers: { Authorization: `Bearer ${params.token}` }
        }
        try {
            await Axios.patch("edits/verify-new-email", {}, config)
            toast.success('New email successfully verified!');
        } catch (error) {
            console.log(error);
            toast.error('Failed to verify new email!');
        }
    }

    const handleHomeButton = () => navigate('/')

    useEffect(() => {
        handleVerification()
    }, [])

    return (
        <Card>
            <div className="flex flex-col items-center justify-center h-screen">
                <Typography variant="h4" className="font-bold mb-4">
                    Email Successfully Verified!
                </Typography>
                <Typography variant="body1" className="mb-4">
                    Your new email address has been successfully verified.
                </Typography>
                <Typography variant="body1" className="mb-4">
                    Press the "Home" button to continue browsing this website.
                </Typography>

                <Button color="green" ripple="light" onClick={handleHomeButton}>
                    Home
                </Button>
            </div>
        </Card>
    );
};
