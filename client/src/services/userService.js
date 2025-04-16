import { pantryPlannerDB } from "./api"

export const registerUser = async (formData) =>{

    try{
        const response = await pantryPlannerDB.post('/users', formData)
        console.log(response.data)
        return response.data
    } catch (err){
        console.log(err)
        throw err.response?.data || {message: "unexpected error"}
    }
    
} 