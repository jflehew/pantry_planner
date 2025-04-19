import { pantryPlannerDB } from "./api"

export const registerUser = async (formData) =>{
        const response = await pantryPlannerDB.post('/users/register', formData)
        return response.data
} 

export const loginUser = async (formData) => {
        const response = await pantryPlannerDB.post('/users/login', formData)
        return response.data
}

export const authenticateUser = async () => {
        const response = await pantryPlannerDB.get('/users/authenticate')
        return response.data
}

export const logoutUser = async () => {
        const response = await pantryPlannerDB.get('/users/logout')
        return response.data
}