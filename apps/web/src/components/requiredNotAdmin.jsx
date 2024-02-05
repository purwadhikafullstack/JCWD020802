import { Navigate, Outlet } from "react-router-dom";

export function RequiredNotAdmin() {
    const adminToken = localStorage.getItem("adminToken")

    return (
        <>
            {
                !adminToken ? <Outlet /> : <Navigate to="/dashboard-admin" />
            }
        </>
    )
}