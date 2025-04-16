import axios from "axios"

export const pantryPlannerDB = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})



