import { useState } from "react"
import { registerUser } from "../services/userService"
import { useUserAuthContext } from '../context/UserAuthContext'
import { useNavigate } from 'react-router-dom'


export const RegisterUser = () => {
    const {user, setUser, loading, setLoading} = useUserAuthContext()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [error, setError] = useState("")

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()
        if (formData.password !== formData.confirmPassword){
            return setError("passwords do no match")
        }

        try{
            const res = await registerUser(formData)
            setUser(res)
            setLoading(false)
            navigate('/dashboard')
        } catch(err){
            setError(err.errors?.email || err.message || "registration failed")
        }
    }

    return(
        <>
            <form onSubmit={handleSubmit}>
                <label>First Name:
                    <input 
                        type="text" 
                        name="firstName" 
                        placeholder="First Name"
                        onChange={handleChange}
                    />
                </label>
                <label>last Name:
                    <input 
                        type="text" 
                        name="lastName" 
                        placeholder="Last Name"
                        onChange={handleChange}
                    />
                </label>
                <label>email:
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email"
                        onChange={handleChange}
                    />
                </label>
                <label>First Name:
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password"
                        onChange={handleChange}
                    />
                </label>
                <label>First Name:
                    <input 
                        type="password" 
                        name="confirmPassword" 
                        placeholder="Confirm Password"
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Register</button>
                {error && <p>{error}</p>}
            </form>
        </>
    )
}