import { useUserAuthContext } from "../context/UserAuthContext";
import { logoutUser } from "../services/userService";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Dashboard } from "./Dashboard";

export const Header = () => {
    const {user, setUser} = useUserAuthContext()
    const navigate = useNavigate()
    const isLoginPage = location.pathname === '/login'
    const isRegisterPage = location.pathname === '/register'
    const isDashboard = location.pathname ==='/dashboard'
    const isProduct = location.pathname === '/product/add' || location.pathname.startsWith('/product/update/')
    const isGroceryList = location.pathname === '/grocerylist'

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
        <div className="header">
            <div className="w-full">
                <h1 className="m-6">
                    {user 
                    ? <p> Welcome {user.firstName} {user.lastName}</p> 
                    : <p>Welcome to Pantry Planner</p>}
                </h1>
            </div>
            <div className="nav-div">
                {!user && (
                    <>
                        {!isLoginPage && <p><a className="nav-link" href="/login">Login</a></p>}
                        {!isRegisterPage && <p><a className="nav-link" href="/register">Register</a></p>}
                    </>
                )}
                {user && !isProduct && <Link className="nav-link" to='/product/add'>Add a product to your pantry!</Link>}<br/> 
                {user && !isDashboard && <Link className="nav-link" to={'/dashboard'}>Dashboard</Link> }<br/>
                {user && !isGroceryList && <Link className="nav-link" to={'/grocerylist'}>Your Grocery List</Link>}
                {user && <p><a className="nav-link" href="" onClick={handelLogout}>Logout</a></p>}
            </div>
        </div>
        

    )
}