import { Navigate, Outlet } from "react-router-dom";
import { useUserAuthContext } from "./UserAuthContext";

export const PublicRoute = () => {
    const {user} = useUserAuthContext()

    return user ? <Navigate to="/dashboard"/> : <Outlet/>
}