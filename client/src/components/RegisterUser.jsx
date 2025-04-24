import { useState } from "react"
import { registerUser } from "../services/userService"
import { useUserAuthContext } from '../context/UserAuthContext'
import { useNavigate } from 'react-router-dom'


export const RegisterUser = () => {
    const {user, setUser, loading, setLoading} = useUserAuthContext()
    const [submitting, setSubmitting] = useState(false)
    const [usedInput, setUsedInput] = useState ({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        confirmPassword: false
    })
    const [serverErrors, setServerErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [isValid, setIsValid] = useState({
        firstName: false,
        lastName: false,
        email: false,
        password: {
            meetsCredentials: false,
            atleastEightChars: false,
            validSymbol: false,
            validNumber: false,
            validUpperCase: false,
            validLowerCase: false
        },
        confirmPassword:false
    })
    const {firstName, lastName, email, password, confirmPassword } = isValid
    const isFormValid = 
        isValid.firstName &&
        isValid.lastName &&
        isValid.email &&
        isValid.confirmPassword &&
        isValid.password.meetsCredentials

    const passwordMessages = {
        meetsCredentials: "Your password must contain:",
        atleastEightChars: "Eight characters",
        validSymbol: "A symbol (!, @, #, $, etc...)",
        validNumber: "A number",
        validUpperCase: "An upper case letter",
        validLowerCase: "An lower case letter"
    }
    const validatePasswordCriteria = password => {
        return {
        atleastEightChars: /.{8,}/.test(password),
        validSymbol: /[\W_]/.test(password),
        validNumber: /\d/.test(password),
        validUpperCase: /[A-Z]/.test(password),
        validLowerCase: /[a-z]/.test(password)
    }}
    const validateFormCriteria = (name, value, currentFormData) =>{
        if (name === 'firstName' || name == 'lastName'){
            const isValidLength = value.length >= 1 && value.length <= 255
            setIsValid(prev => ({...prev, [name]: isValidLength}))
        }
        if (name === 'email'){
            const isValidEmail = /^[\w.-]+@[\w.-]+\.\w+$/.test(value)
            setIsValid(prev => ({...prev, [name]: isValidEmail}))
        }
        if (name === 'confirmPassword' || name === 'password'){
            const password = name === 'password' ? value : currentFormData.password
            const confirm = name === 'confirmPassword' ? value : currentFormData.confirmPassword
            setIsValid(prev => ({...prev, confirmPassword: password === confirm}))
        }

    }

    const handleChange = e => {
        const {name, value} = e.target
        setFormData(prev => {
            const updatedFormData = {...prev, [name]: value}
            validateFormCriteria(name, value, updatedFormData)

            if (name === 'password'){
                const criteria = validatePasswordCriteria(value)
                setIsValid(prev =>({
                    ...prev, password: {...criteria, meetsCredentials: Object.values(criteria).every(Boolean)}
                }))}
            return updatedFormData
        })
    }
    
    const handleSubmit = async (e) =>{
        e.preventDefault()
        setSubmitting(true)
        try{
            const res = await registerUser(formData)
            setUser(res)
            setLoading(false)
            navigate('/dashboard')
        } catch(err){
            Object.entries(err).forEach(([field, message]) => {
            setServerErrors(prev => ({...prev, [field]: message}))
            })
        } finally {
            setSubmitting(false)
        }
    }
    const handleBlur = e => {
        const { name } = e.target
        setUsedInput(prev => ({...prev, [name]: true}))
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
                        onBlur={handleBlur}
                    />
                    {usedInput.firstName && !firstName && <p>Your first name must be between 1 and 255 characters in length</p>}
                    {serverErrors.firstName && <p>{serverErrors.firstName}</p>}
                </label>
                <label>last Name:
                    <input 
                        type="text" 
                        name="lastName" 
                        placeholder="Last Name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    {usedInput.lastName && !lastName && <p>Your last name must be between 1 and 255 characters in length</p>}
                    {serverErrors.lastName && <p>{serverErrors.lastName}</p>}
                </label>
                <label>email:
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    {usedInput.email && !email && <p>You must enter a valid email!</p>}
                    {serverErrors.email && <p>{serverErrors.email}</p>}
                </label>
                <label>Password:
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    {usedInput.password && (
                        <>
                            {!password.meetsCredentials && (
                                <p>{passwordMessages.meetsCredentials}</p>
                            )}
                            {Object.entries(password)
                                .filter(([key, value]) => key !== 'meetsCredentials' && !value)
                                .map(([key]) => (
                                <p key={key}>{passwordMessages[key]}</p>
                                ))}
                        </>
                        )}
                        {serverErrors && <p>{serverErrors.password}</p>}
                </label>
                <label>Confirm Password:
                    <input 
                        type="password" 
                        name="confirmPassword" 
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    {usedInput.confirmPassword && !confirmPassword && <p>Your passwords must match</p>}
                    {serverErrors && <p>{serverErrors.confirmPassword}</p>}
                </label>
                <button type="submit" disabled={!isFormValid || submitting}>
                    { submitting ? "Registering..." : "Register" }
                </button>
            </form>
        </>
    )
}