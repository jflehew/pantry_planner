import { pantryPlannerDB } from "./api"

export const createProduct = async (formData) => {
    const response = await pantryPlannerDB.post('/products/create', formData)
    return response.data
}