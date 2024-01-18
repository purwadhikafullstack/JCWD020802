import { Navigate, Outlet } from "react-router-dom";

export function Required() {
    const token = localStorage.getItem("token")

    return (
        <>
            {
                token ? <Outlet /> : <Navigate to="/" />
            }
        </>
    )
}