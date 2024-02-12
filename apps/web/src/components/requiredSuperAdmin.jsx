import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export function RequiredSuperAdmin() {
    const user = useSelector((state) => state.user.value)
    console.log(user);

    return (
        <>
            {
                user.role === 'Super Admin' ? <Outlet /> : <Navigate to="/" />
            }
        </>
    )
}