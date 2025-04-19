import { useEffect, useState } from "react"
import { getNearbyStoresByGeolocation, getNearbyStoresByZipcode } from "../services/krogerService"
import { useUserAuthContext } from "../context/UserAuthContext"

export const AddProduct = () => {
    const defaultStoreLocation = {
        storeChosen: false,
        storeName: "",
        locationId: ""
    }
    const[stores, setStores] = useState([])
    const[error, setError] = useState(null)
    const[loading, setLoading] = useState(true)
    const[locationDenied, setLocationDenied] = useState(false)
    const[zipcode, setZipcode] = useState("")
    const[storeLocation, setStoreLocation] = useState(defaultStoreLocation)
    const { user } = useUserAuthContext()

    useEffect(() => {
        if("geolocation" in navigator){
            navigator.geolocation.getCurrentPosition(
                async (postion) => {
                    const {latitude, longitude} = postion.coords
                    try{
                        const storeData = await getNearbyStoresByGeolocation(latitude, longitude)
                        setStores(storeData)
                    } catch(err) {
                        console.error("kroger store fetch error", err)
                        setError("failed to fetch nearby kroger stores")
                    } finally {
                        setLoading(false)
                    }
                },
                (err) => {
                    console.error("Location permission denied", err)
                    setLocationDenied(true)
                    setError("Location access denied")
                    setLoading(false)
                }
            )
    }   else {
        setLocationDenied(true)
        setError("Geolocation is not supported in your browser")
        setLoading(false)
    }
    }, [])

    const handleLocationSearch = async e => {
        e.preventDefault()
        setLoading(true)
        try{
            const storeData = await getNearbyStoresByZipcode(zipcode)
            setStores(storeData)

            console.log(storeData)
        } catch(err) {
            console.error("kroger store fetch error", err)
            setError("Failed to fetch nearby kroger stores")
        } finally {
            setLoading(false)
            setZipcode("")
        }
    }

    const handleStoreLocation = store => {
        setStoreLocation(prev => ({
            ...prev,
            storeChosen: true,
            storeName: store.name,
            locationId: store.locationId
        }) )
        console.log(store)
    }




return (
    <div>
        <h2>Nearby Kroger Stores</h2>
        {locationDenied && (
            <form onSubmit={handleLocationSearch}>
                <label>
                    <input 
                        type="text" 
                        value={zipcode} 
                        onChange={e => 
                        setZipcode(e.target.value)} 
                    />
                </label>
                <button type="submit">Find Nearby Stores</button>
            </form>
        )}

        {loading && <p>Loading nearby stores...</p>}
        {!storeLocation.storeChosen
            ?<ul>
                {stores.map((store) => (
                    <div key={store.locationId}>
                        <li>{store.name} {store.locationId}</li>
                        <button onClick={() => handleStoreLocation(store)}>Select Location</button>
                    </div>
                ))}
            </ul>
            : <button onClick={() => setStoreLocation(defaultStoreLocation)}>Choose A different location</button>
            }
            <p>Chosen store: {storeLocation.storeName}</p>
    </div>
)
}