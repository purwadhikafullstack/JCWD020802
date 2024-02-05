import { Navigate, Outlet } from "react-router-dom";

export function RequiredCustomer() {
    const token = localStorage.getItem("token")

    return (
        <>
            {
                token ? <Outlet /> : <Navigate to="/" />
            }
        </>
    )
}