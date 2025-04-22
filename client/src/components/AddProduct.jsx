import { useEffect, useState, useRef } from "react"
import { getNearbyStoresByGeolocation, getNearbyStoresByZipcode, getProductsByTermAndLocation } from "../services/krogerService"
import { useUserAuthContext } from "../context/UserAuthContext"
import ClipLoader from 'react-spinners/Cliploader'

export const AddProduct = () => {    
    const { user } = useUserAuthContext()
    const defaultStoreLocation = {
        storeChosen: false,
        storeName: "",
        locationId: ""
    }
    const[storeLocation, setStoreLocation] = useState(defaultStoreLocation)
    const defaultProduct = {
        productName: "",
        description: "",
        brand: "",
        price: 0.00,
        householdQty: 0,
        qtyType: "",
        purchaseQty: 0,
        image: "",
        productId: "",
        purchaseLocation: storeLocation.storeName,
        locationId: storeLocation.locationId,
        userId: user.id
    }
    const [product, setProduct] = useState(defaultProduct)
    const[stores, setStores] = useState([])
    const[error, setError] = useState(null)
    const[storesLoading, setStoresLoading] = useState(true)
    const[productsLoading, setProductsLoading] = useState(false)
    const[locationDenied, setLocationDenied] = useState(false)
    const[zipcode, setZipcode] = useState("")
    const [products, setProducts] = useState([])
    const debounceTimeout = useRef(null)

    

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
                        setStoresLoading(false)
                    }
                },
                (err) => {
                    console.error("Location permission denied", err)
                    setLocationDenied(true)
                    setError("Location access denied")
                    setStoresLoading(false)
                }
            )
    }   else {
        setLocationDenied(true)
        setError("Geolocation is not supported in your browser")
        setStoresLoading(false)
    }
    }, [])

    const handleLocationSearch = async e => {
        e.preventDefault()
        setStoresLoading(true)
        try{
            const storeData = await getNearbyStoresByZipcode(zipcode)
            setStores(storeData)

            console.log(storeData)
        } catch(err) {
            console.error("kroger store fetch error", err)
            setError("Failed to fetch nearby kroger stores")
        } finally {
            setStoresLoading(false)
            setZipcode("")
        }
    }

    const handleStoreLocation = e => {
        const selectedStoreId = e.target.value
        const selectedStore = stores.find(store => store.locationId === selectedStoreId)
        selectedStore 
        ? setStoreLocation(prev => ({
            ...prev,
            storeChosen: true,
            storeName: selectedStore.name,
            locationId: selectedStore.locationId
        }) )
        : setStoreLocation(defaultStoreLocation)
    }
    const handleProductGet = async e =>{
        const {value} = e.target
        if (debounceTimeout.current){
            clearTimeout(debounceTimeout.current)
        }
        if(value.length >= 3){
            debounceTimeout.current = setTimeout(async () =>{
            try {
                setProductsLoading(true)
                const productData = await getProductsByTermAndLocation(value, storeLocation.locationId)
                setProducts(productData)
            } catch (err){
                console.error("Kroger product fetch error", error)
                setError("Failed to find kroger products")
            } finally {
                setProductsLoading(false)
            }
        }, 1000)
        }
    }

    const handleProductCreate = async e => {
        e.preventDefault()
        const {name, value} = e.target
    }
    const handleProductChange = e => {

    }
    const addProductFromKroger = (description, brand, images, items, productId) => {
        console.log(description, brand, images, items, productId)
        let image = "Image Not Available"
        let price = 0.00
        let purchaseQty = 0.00
        let qtyType = ""
        if (images.length > 0){
            images.filter(image.perspective == "front")
            .flatMap(img => (img.sizes || [])
            .filter(size => size.size === "small")
            .map(size => image = size.url)
            )
        }
        if (items.length > 0){
            items.map(item => {
                if (item.price){
                price = item.price.regular}
                if (item.size){

                }
            })
        }
        setProduct(prev => ({
            ...prev,
            description: description,
            brand: brand,
            image: image,
            price: price,
            
        }))
    }
return (
    <>
        <div>
            <h2>Nearby Kroger Stores</h2>
            {locationDenied && (
                <form onSubmit={handleLocationSearch}>
                    <label>Please enter your zipcode:
                        <input 
                            type="text" 
                            value={zipcode} 
                            onChange={e => 
                            setZipcode(e.target.value)}
                            placeholder="Zipcode"
                        />
                    </label>
                    <button type="submit">Find Nearby Stores</button>
                </form>
            )}
            <select onChange={handleStoreLocation}>
                <option value="" >
                    {
                    storesLoading || stores.length === 0 
                    ? "Looking for store locations near you!" 
                    : "Please select your preferred shopping location!"
                    }
                </option>
                {stores.map((store) => (
                    <option key={store.locationId} value={store.locationId}  >{store.name}</option>
                ))}
            </select>
        </div >
            <label>Search for a product:
                <input type="text" onChange={handleProductGet}/>
            </label>
        <div style={{ maxHeight: "400px", overflowY: "auto", border: "1px solid #ccc" }} >
            <table>
                <thead>
                    <tr>
                        <td>Image:</td>
                        <td>Product:</td>
                        <td>Brand:</td>
                        <td>Price:</td>
                        <td>Size:</td>
                        <td>Add Product To Panytry:</td>
                    </tr>
                </thead>
                <tbody>{!productsLoading && products.map(({description, brand, images = [], items = [], productId}) => (
                    <tr key={productId}>
                        <td>
                            {images.length > 0 ? 
                            images
                                .filter(img => img.perspective ==="front") 
                                    .flatMap(img => (img.sizes || []).filter(size => size.size === "small")
                                        .map(size => (
                                            <img style={{width: "50px"}} src={size.url} alt={`Thumbnail of${description}`} />
                                        ))
                            ):
                            <img style={{width: "50px"}} alt="Image not available" src="/imageNotAvailable.png"/>
                            } 
                        </td>
                        <td>{description}</td>
                        <td>{brand}</td>
                        {items.length > 0 &&
                        items.map(item => (
                            item.price ? <td>${item.price.regular}</td> : <td>No Price Found</td> 
                        ))
                        }
                        {items.length > 0 &&
                        items.map(item =>(
                            item.size ? <td>{item.size}</td> : <td>No Size Found</td>
                        ))
                        }
                        <td><button onClick={() => addProductFromKroger(description, brand, images, items, productId)}>Add Product</button></td>
                    </tr>
                    ))}
                    {productsLoading && (
                    <tr>
                        <td colSpan="5" style={{ height: "100px", textAlign: "center" }}>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                                <ClipLoader color="#4a90e2" size={50} />
                            </div>
                        </td>
                    </tr>
                    )}
                </tbody>
            </table>
        </div>
        <div>
            <form onSubmit={handleProductCreate}>
                    <label>Product Name:
                        <input 
                            type="text" 
                            onChange={handleProductChange} 
                            value={product.productName}
                            name="productName"
                        />
                    </label>
                    <label>Product Description:
                        <textarea 
                            type="text" 
                            onChange={handleProductChange} 
                            name="description"
                            value={product.description}
                        >
                        </textarea>
                    </label>
                    <label>Product Brand:
                        <input 
                            type="text" 
                            onChange={handleProductChange} 
                            value={product.brand}
                            name="brand"
                        />
                    </label>
                    <label>Product Price:
                        <input 
                            type="number"
                            step="0.01"
                            min="0.00"
                            onChange={handleProductChange} 
                            value={product.price}
                            name="price"
                        />
                    </label>
                    <label>Product In Home Quantity:
                        <input 
                            type="number"
                            min="0.00"
                            onChange={handleProductChange} 
                            value={product.householdQty}
                            name="householdQty"
                        />
                    </label>
                    <label>Product Quantity Type:
                        <input 
                            type="text" 
                            onChange={handleProductChange} 
                            value={product.qtyType}
                            name="qtyType"
                        />
                    </label>
                    <label>Product Purchase Quantity:
                        <input 
                            type="number"
                            min="0.00" 
                            onChange={handleProductChange} 
                            value={product.purchaseQty}
                            name="purchaseQty"
                        />
                    </label>
                    {product.image !== "" &&
                    <label>Product image:
                        <input 
                            type="text" 
                            onChange={handleProductChange} 
                            value={product.image}
                            name="image"
                        />
                    </label>}
                    {product.productId &&
                    <label>Product Identification Number:
                        <input 
                            type="text" 
                            onChange={handleProductChange} 
                            value={product.productId}
                            name="productId"
                        />
                    </label>}
                    <label>Purchase Location:
                        <input 
                            type="text" 
                            onChange={handleProductChange} 
                            value={product.purchaseLocation}
                            name="purchaseLocation"
                        />
                    </label>
                    {product.locationId &&
                    <label>Product Location Identification:
                        <input 
                            type="text" 
                            onChange={handleProductChange} 
                            value={product.locationId}
                            name="locationId"
                        />
                    </label>}
            </form>
        </div>
    </>
)
}