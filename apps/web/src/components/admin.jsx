import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export function Admin() {
    const user = useSelector((state) => state.user.value);

    const allowedRoles = ['Super Admin', 'Warehouse Admin'];

    return (
        <>
            {
                allowedRoles.includes(user.role) ? <Outlet /> : <Navigate to="/" />
            }
        </>
    )
}