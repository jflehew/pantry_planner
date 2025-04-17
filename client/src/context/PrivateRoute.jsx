import { Outlet, Navigate, useNavigate } from "react-router-dom"
import { useUserAuthContext } from "./UserAuthContext"
import ClipLoader from 'react-spinners/Cliploader'
import { authenticateUser } from "../services/userService"
import { useEffect } from "react"

export const PrivateRoute = () =>{
    const {user, setUser, loading, setLoading} = useUserAuthContext()
    const navigate = useNavigate()

    useEffect(() =>{
        const checkSession = async () => {
            const delay = ms => new Promise(res => setTimeout(res, ms))
            await delay(300)
            try{
                const result = await authenticateUser()
                await delay(300)
                setUser(result)
            } catch {
                setUser(null)
                await delay(300)
                navigate('/login')
            } finally {
                setLoading(false)
            }
        }
        if(user === null && loading === true){
        checkSession()}
    },[])

    if (loading) return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "4rem" }}>
            <ClipLoader color="#4a90e2" size={50} />
        </div>
    )
    return user ? <Outlet /> : <Navigate to="/login" replace/>

}