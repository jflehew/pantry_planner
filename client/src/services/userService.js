import { pantryPlannerDB } from "./api"

export const registerUser = async (formData) =>{

    try{
        const response = await pantryPlannerDB.post('/users/register', formData)
        console.log(response.data)
        return response.data
    } catch (err){
        console.log(err)
        throw err.response?.data || {message: "unexpected error"}
    }
    
} 

export const loginUser = async (formData) => {

    try{
        const response = await pantryPlannerDB.post('/users/login', formData)
        console.log(response.data)
        return response.data
    } catch(err){
        console.log(err)
        throw err.response?.data || {message: "unexpected error"}
    }
}

export const authenticateUser = async () => {
    try{
        const response = await pantryPlannerDB.get('/users/authenticate')
        return response.data
    } catch(err){
        console.log(err)
        throw err.response?.data || {message: "unexpected error"}
    }
}

export const logoutUser = async () => {
    try{
        const response = await pantryPlannerDB.get('/users/logout')
        return response.data
    } catch(err){
        console.log(err)
        throw err.response?.data || {message: "unexpected error"}
    }
}