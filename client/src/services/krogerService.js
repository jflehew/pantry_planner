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