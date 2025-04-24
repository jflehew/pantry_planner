import { pantryPlannerDB } from "./api";

export const addAllToList = async () => {
    const response = await pantryPlannerDB.post('/grocerylist/add/threshold')
    return response.data
}

export const getGroceryList = async () => {
    const response = await pantryPlannerDB.get('/grocerylist/get/list')
    return response.data
}

export const updateProductPurchase = async (id) => {
    const response = await pantryPlannerDB.post('/grocerylist/update/purchase', id)
    return response.data
}

export const deleteGroceryList = async () => {
    const response = await pantryPlannerDB.post('/grocerylist/delete')
    return response.data
}

export const addOneToList = async (id) => {
    const response = await pantryPlannerDB.post('/grocerylist/add/one', id)
    return response.data
}