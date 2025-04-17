import { useUserAuthContext } from "../context/UserAuthContext";
import { logoutUser } from "../services/userService";
import { useNavigate, Link, useLocation } from "react-router-dom";

export const Header = () => {
    const {user, setUser} = useUserAuthContext()
    const navigate = useNavigate()
    const isLoginPage = location.pathname === '/login'
    const isRegisterPage = location.pathname === '/register'

    const handelLogout = async e => {
        e.preventDefault()
        try {
            await logoutUser()
            setUser(null)
            navigate('/login')
        } catch (err) {
            console.error("Logout failed:", err)
        }
    }

    return(
        <div>
            <h1>
                {user 
                ? <p> Welcome {user.firstName} {user.lastName}</p> 
                : <p>Welcome to Pantry Planner</p>}
            </h1>
            {!user && (
                <>
                    {!isLoginPage && <p><a href="/login">Login</a></p>}
                    {!isRegisterPage && <p><a href="/register">Register</a></p>}
                </>
            )}
            {user && <p><a href="" onClick={handelLogout}>Logout</a></p>}
        </div>

    )
}