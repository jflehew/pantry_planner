import { pantryPlannerDB } from "./api"

export const createProduct = async (formData) => {
    const response = await pantryPlannerDB.post('/products/create', formData)
    return response.data
}

export const getAllProducts = async (formData) => {
    const response = await pantryPlannerDB.get('/products/get/all')
    return response.data
}

export const deleteProduct = async (id) => {
    const response = await pantryPlannerDB.delete('/products/delete', {data:{id}})
    return response
}

export const getOneProduct = async (id) => {
    const response = await pantryPlannerDB.get('/products/get/one', {params:{id}})
    return response.data
}

export const updateProduct = async (formData) => {
    const response = await pantryPlannerDB.post('/products/update', formData)
    return response.data
}

export const updateProductQty = async (formData) => {
    const response = await pantryPlannerDB.post('/products/update/qty', formData)
    return response.data
}