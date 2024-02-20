import { Navigate, Outlet } from "react-router-dom";

export function RequiredCustomer() {
    const token = localStorage.getItem("token")

    return (
        <div>
            {
                token ? <Outlet /> : <Navigate to="/" />
            }
        </div>
    )
}