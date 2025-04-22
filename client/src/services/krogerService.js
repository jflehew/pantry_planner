import { krogerAPI } from "./api";

export const getNearbyStoresByGeolocation = async (lat, long) => {
    const response = await krogerAPI.get('/stores/nearby/geolocation', {
        params: {lat, long}
    })
    return response.data.data
}

export const getNearbyStoresByZipcode = async (zipcode) => {
    const response = await krogerAPI.get('/stores/nearby/zipcode', {
    params: {zipcode}})
    return response.data.data
}

export const getProductsByTermAndLocation = async (term, locationId) => {
    const response = await krogerAPI.get('/products/name/storelocation', {
        params: {term, locationId}
    })
    console.log(response.data.data)
    return response.data.data
}