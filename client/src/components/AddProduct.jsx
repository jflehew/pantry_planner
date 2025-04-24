import { useEffect, useState, useRef } from "react"
import { getNearbyStoresByGeolocation, getNearbyStoresByZipcode, getProductsByTermAndLocation } from "../services/krogerService"
import { useUserAuthContext } from "../context/UserAuthContext"
import ClipLoader from 'react-spinners/Cliploader'
import { createProduct, getOneProduct, updateProduct } from "../services/productService"
import { useParams, useNavigate } from "react-router-dom"

export const AddProduct = () => {    
    const {productId} = useParams()
    const navigate = useNavigate()
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
        householdQty: 0.00,
        householdQtyThreshold: 0.00,
        qtyType: "",
        purchaseQty: 0.00,
        image: "",
        productId: "",
        purchaseLocation: storeLocation.storeName,
        locationId: storeLocation.locationId,
        userId: user.id
    }
    const defaultServerErrors = {

        productName: "",
        description: "",
        brand: "",
        price: "",
        householdQty: "",
        householdQtyThreshold: "",
        qtyType: "",
        purchaseQty: "",
        image: "",
        productId: "",
        purchaseLocation: "",
        locationId: ""
    }
    const defaultInputsUsed ={
        productName: false,
        description: false,
        brand: false,
        price: false,
        householdQty: false,
        householdQtyThreshold: false,
        qtyType: false,
        purchaseQty: false,
        image: false,
        productId: false,
        purchaseLocation: false,
        locationId: false
    }
    const defaultProductIsValid = {
        productName: false,
        description: false,
        brand: false,
        price: false,
        householdQty: false,
        householdQtyThreshold: false,
        qtyType: false,
        purchaseQty: false,
        purchaseLocation: false,
    }
    const [inputUsed, setInputUsed] = useState(defaultInputsUsed)
    const [product, setProduct] = useState(defaultProduct)
    const[stores, setStores] = useState([])
    const[error, setError] = useState(null)
    const[storesLoading, setStoresLoading] = useState(true)
    const[productsLoading, setProductsLoading] = useState(false)
    const[locationDenied, setLocationDenied] = useState(false)
    const[zipcode, setZipcode] = useState("")
    const [products, setProducts] = useState([])
    const debounceTimeout = useRef(null)
    const [addedProducts, setAddedProducts] = useState([])
    const [serverErrors, setServerErrors] = useState(defaultServerErrors)
    const [productIsValid, setProductIsValid] = useState(defaultProductIsValid)
    const [submittingProduct, setSubmittingProduct] = useState(false)
    const [update, setUpdate] = useState(false)
    const isFormValid = 
        productIsValid.productName &&
        productIsValid.description &&
        productIsValid.brand &&
        productIsValid.price &&
        productIsValid.householdQty &&
        productIsValid.householdQtyThreshold &&
        productIsValid.qtyType &&
        productIsValid.purchaseQty &&
        productIsValid.purchaseLocation

    const handleProductValidation = (name, value) => {
        if(
            name === "productName" || 
            name === "description" ||
            name === "brand" ||
            name === "qtyType" ||
            name === "purchaseLocation"
        ){  
            console.log(name)
            const valid = value.length >= 1 && value.length <= 255
            setProductIsValid(prev => ({...prev, [name]: valid}))
        }
        if(
            name === "price" ||
            name === "householdQty" ||
            name === "purchaseQty"
        ){
            const valid = !isNaN(value) && Number(value) >= 0
            setProductIsValid(prev => ({...prev, [name]: valid}))
        }
        if (name === "householdQtyThreshold" && !isNaN(value)){
            const valid = Number(value) >= 0.00 && Number(value) <= 1
            setProductIsValid(prev => ({...prev, [name]: valid}))
        }
    }
    
    


    useEffect(() => {
        const fetchProduct = async () =>{
        if(productId){
            setUpdate(true)
            try{
                const res = await getOneProduct(productId)
                setProduct(prev => ({...prev, ...res}))
                setProductIsValid({
                    productName: true,
                    description: true,
                    brand: true,
                    price: true,
                    householdQty: true,
                    householdQtyThreshold: true,
                    qtyType: true,
                    purchaseQty: true,
                    purchaseLocation: true
                })
            } catch (err){
                console.error(err)
            } 
        }}
        fetchProduct()
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
        if (selectedStoreId == -1){
            setStoreLocation(defaultStoreLocation)
            setProduct(prev => ({
                ...prev,
                locationId: "",
                purchaseLocation: ""
            }))
        }
        const selectedStore = stores.find(store => store.locationId === selectedStoreId)
        if (selectedStore) {
        setStoreLocation(prev => ({
            ...prev,
            storeChosen: true,
            storeName: selectedStore.name,
            locationId: selectedStore.locationId
        }) )
        setProduct(prev => ({
            ...prev, 
            locationId: selectedStore.locationId,
            purchaseLocation: selectedStore.name
        }))}
        else setStoreLocation(defaultStoreLocation)
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
        setSubmittingProduct(true)
        try{
            const newProduct = await createProduct(product)
            setAddedProducts(prev => [...prev, newProduct])
            setProduct(defaultProduct)
            setProductIsValid(defaultProductIsValid)
            setInputUsed(defaultInputsUsed)
        } catch (err) {
                Object.entries(err).forEach(([field, message]) => {
                setServerErrors(prev => ({...prev, [field]: message}))
            })
            console.error("Failed to create product", err)
        } finally {
            setSubmittingProduct(false)
        }
    }
    const handleProductChange = e => {
        const {name, value} = e.target
        setProduct(prev => ({...prev, [name]: value }))

    }
    const addProductFromKroger = (description, brand, images, items, productId) => {
        let image = "Image Not Available"
        let price = 0.00
        let purchaseQty = 0.00
        let qtyType = ""
        if (images.length > 0){
            const itemImage = images
            .filter(image => image.perspective === "front")
            .flatMap(img => img.sizes || [])
            .find(size => size.size === "small")
            
            if(itemImage){
                image = itemImage.url
            }
        }
        if (items.length > 0){
            items.map(item => {
                if (item.price){
                price = item.price.regular}
                if (item.size){
                    const size = item.size.trim().toLowerCase()
                    const regex = /^(\d+\/\d+|\d+(?:\.\d+)?)(?:\s*)?([a-zA-Z]+(?:\s+[a-zA-Z]+)*)?/
                    const match = size.match(regex)
                    if (match){
                        let [_, qty, unit] = match
                        if(qty.includes('/')){
                            const [num, denom] = qty.split('/').map(Number)
                            qty = denom !== 0 ? num / denom : null
                        } else {
                            qty = parseFloat(qty)
                        }
                        purchaseQty = qty
                        qtyType  = unit || ""
                    }
                }
            })
        }
        setProduct(prev => ({
            ...prev,
            description: description,
            brand: brand,
            image: image,
            price: price,
            qtyType: qtyType,
            purchaseQty: purchaseQty,
            productId: productId,
            purchaseLocation: storeLocation.storeName,
            locationId: storeLocation.locationId
        }))
        setProductIsValid(prev => ({
            ...prev,
            description: true,
            brand: true,
            price: true,
            householdQty: true,
            householdQtyThreshold: true,
            qtyType: true,
            purchaseQty: true,
            purchaseLocation: true
        }))
    }
    const handleBlur = e => {
        const {name, value} = e.target
        handleProductValidation(name, value)
        setInputUsed(prev => ({...prev, [name]: true}))
    }
    const handleProductUpdate = async e => {
        e.preventDefault()
        setSubmittingProduct(true)
        try{
            await updateProduct(product)
            navigate('/dashboard')
        } catch(err){
            console.error(err)
        } finally{
            setSubmittingProduct(false)
        }
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
                <option value={-1}>No Store Location</option>
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
                <tbody>
                    {products.length === 0 && !productsLoading && <tr colSpan="6"><td>Sorry, we couldn't find any products at that location. Please try another location or using the No Store Location Option</td></tr>}
                    {!productsLoading && products.map(({description, brand, images = [], items = [], productId}) => (
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
                        <td>{items[0]?.price?.regular ? `${items[0].price.regular}` : "Price not found"}</td>
                        <td>{items[0]?.size ? `${items[0].size}` : "Size Not found"}</td>
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
            <h2></h2>
            <form onSubmit={!update ? handleProductCreate : handleProductUpdate}>
                    <label>Product Name:
                        <input 
                            type="text" 
                            onChange={handleProductChange} 
                            value={product.productName}
                            name="productName"
                            onBlur={handleBlur}
                        />
                        {inputUsed.productName && !productIsValid.productName && <p>You must enter a product name</p>}
                        {serverErrors.productName && <p>{serverErrors.productName}</p>}
                    </label>
                    <label>Product Description:
                        <textarea 
                            type="text" 
                            onChange={handleProductChange} 
                            name="description"
                            value={product.description}
                            onBlur={handleBlur}
                        >
                        </textarea>
                        {inputUsed.description && !productIsValid.description && <p>You must enter a description for your product</p>}
                        {serverErrors.description && <p>{serverErrors.description}</p>}
                    </label>
                    <label>Product Brand:
                        <input 
                            type="text" 
                            onChange={handleProductChange} 
                            value={product.brand}
                            name="brand"
                            onBlur={handleBlur}
                        />
                        {inputUsed.brand && !productIsValid.brand && <p>You must enter a brand for your product</p>}
                        {serverErrors.brand && <p>{serverErrors.brand}</p>}
                    </label>
                    <label>Product Price:
                        <input 
                            type="number"
                            step="0.01"
                            min="0.00"
                            onChange={handleProductChange} 
                            value={product.price}
                            name="price"
                            onBlur={handleBlur}
                        />
                        {inputUsed.price && !productIsValid.price && <p>You must enter a valid price</p>}
                        {serverErrors.price && <p>{serverErrors.price}</p>}
                    </label>
                    <label>Product In Home Quantity:
                        <input 
                            type="number"
                            min="0.00"
                            step="0.01"
                            onChange={handleProductChange} 
                            value={product.householdQty}
                            name="householdQty"
                            onBlur={handleBlur}
                        />
                        {inputUsed.householdQty && !productIsValid.householdQty && <p>You must enter your current household quantity</p>}
                        {serverErrors.householdQtyThreshold && <p>{serverErrors.householdQtyThreshold}</p>}
                    </label>
                    <label>Product Quantity Type:
                        <input 
                            type="text" 
                            onChange={handleProductChange} 
                            value={product.qtyType}
                            name="qtyType"
                            onBlur={handleBlur}
                        />
                        {inputUsed.qtyType && !productIsValid.qtyType && <p>you must enter the products quantity type</p>}
                        {serverErrors.qtyType && <p>{serverErrors.qtyType}</p>}
                    </label>
                    <label>Product Purchase Quantity:
                        <input 
                            type="number"
                            min="0.00"
                            step="0.01"
                            onChange={handleProductChange} 
                            value={product.purchaseQty}
                            name="purchaseQty"
                            onBlur={handleBlur}
                        />
                        {inputUsed.purchaseQty && !productIsValid.purchaseQty && <p>You must enter the pruchase quantity for your product</p>}
                        {serverErrors.purchaseQty && <p>{serverErrors.purchaseQty}</p>}
                    </label>
                    <label>Product In Home Quantity Threshhold:
                        <input 
                            type="number"
                            min="0.00"
                            max="0.99"
                            step="0.01"
                            onChange={handleProductChange} 
                            value={product.householdQtyThreshold}
                            name="householdQtyThreshold"
                            onBlur={handleBlur}
                        />
                        {inputUsed.householdQtyThreshold && !productIsValid && <p>You must enter your preffered quantity threshold for purchase</p>}
                        {serverErrors.householdQtyThreshold && <p>{serverErrors.householdQtyThreshold}</p>}
                    </label>
                    {product.image !== "" &&
                    <label>Product image: <img style={{width: "50px"}} src={product.image || "/imageNotAvailable.png"} alt={product.description} />
                        <input 
                            type="hidden" 
                            onChange={handleProductChange} 
                            value={product.image}
                            name="image"
                        />
                        {serverErrors.image && <p>{serverErrors.image}</p>}
                    </label>}
                    {product.productId &&
                    <label>Product Identification Number: {product.productId}
                        <input 
                            type="hidden" 
                            onChange={handleProductChange} 
                            value={product.productId}
                            name="productId"
                        />
                        {serverErrors.productId && <p>{serverErrors.productId}</p>}
                    </label>}
                    <label>Purchase Location:
                        <input 
                            type="text" 
                            onChange={handleProductChange} 
                            value={product.purchaseLocation}
                            name="purchaseLocation"
                            onBlur={handleBlur}
                        />
                        {inputUsed.purchaseLocation && !productIsValid.purchaseLocation && <p>You must enter a purchase location</p>}
                        {serverErrors.purchaseLocation && <p>{serverErrors.purchaseLocation}</p>}
                    </label>
                    {product.locationId &&
                    <label>Product Location Identification: {product.locationId}
                        <input 
                            type="hidden" 
                            onChange={handleProductChange} 
                            value={product.locationId}
                            name="locationId"
                        />
                        {serverErrors.locationId && <p>{serverErrors.locationId}</p>}
                    </label>}
                    {!update 
                    ?<button type="submit" disabled={!isFormValid || submittingProduct}>{!submittingProduct ? "Add Product to Pantry": "Adding product to your pantry"}</button>
                    :<button type="submit" disabled={!isFormValid || submittingProduct}>{!submittingProduct ? "Update Product": "updating product in your pantry"}</button>
                    }
            </form>
            {addedProducts.length > 0 &&
            <table>
                <thead>
                    <tr colSpan="3">
                        <td>Products You've added to your pantry this session:</td>
                    </tr>
                    <tr>
                        <td>Your Product Name:</td>
                        <td>Product Description:</td>
                        <td>Product Image:</td>
                    </tr>
                </thead>
                <tbody>
                        {addedProducts.map(addedProduct => (
                            <tr key={addedProduct.productId}>
                                <td>{addedProduct.productName}</td>
                                <td>{addedProduct.description}</td>
                                <td>
                                    {addedProduct.image && addedProduct.image !== "Image Not Available" ? (
                                    <img src={addedProduct.image} alt={addedProduct.description} style={{ width: "50px" }} />) 
                                    : <img style={{width: "50px"}} src="/imageNotAvailable.png"/>}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>}
        </div>
    </>
)
}