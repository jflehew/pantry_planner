import { useState, useEffect } from 'react'
import { useUserAuthContext } from '../context/UserAuthContext'
import { getAllProducts, deleteProduct, updateProductQty } from '../services/productService'
import ClipLoader from 'react-spinners/Cliploader'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

export const Dashboard = () => {
    const navigate = useNavigate()
    const {user} = useUserAuthContext()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchProducts = async () => {
    try{
        setLoading(true)
        const res = await getAllProducts()
        setProducts(res)
    } catch(err){

    } finally{
        setLoading(false)
    }}
    useEffect(()  => {
    fetchProducts()
    }, [])

    const handleDelete = async (id) => {
        try{
            await deleteProduct(id)
        } catch(err){
            console.error(err)
        }finally{
            fetchProducts()
        }
    }
    const handleQtyUpdate = async (e, id) => {
        e.preventDefault()
        const updatedProduct = products.find(product => product.id === id)
        try{
            const res = await updateProductQty(updatedProduct)
            fetchProducts()
        }catch (err){
            console.error(err)
        }
    }
    const handleChange = (e, id) => {
        const { name, value } = e.target;
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === id
                    ? { ...product, [name]: value }
                    : product
            )
        );
    };

    return(
        <>
            <h1>Your Pantry</h1>
            <table>
                <thead>
                    <tr>
                        <td>Image:</td>
                        <td>Product Name:</td>
                        <td>Description:</td>
                        <td>Quantity remaining:</td>
                        <td>Price:</td>
                        <td>Edit/Remove:</td>
                    </tr>
                </thead>
                <tbody>
                {loading && (
                    <tr>
                        <td colSpan="6" style={{ height: "100px", textAlign: "center" }}>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                                <ClipLoader color="#4a90e2" size={50} />
                            </div>
                        </td>
                    </tr>
                    )}
                {products.length === 0 && !loading && 
                <tr><td colSpan="5">You don't have any products in your pantry</td></tr>}
                {products.length > 0 &&
                products.map(product => (
                    <tr key={product.id}>
                    <td> 
                        <img style={{width: "50px"}} src={product.image} alt={product.description} />
                    </td>
                    <td>{product.productName}</td>
                    <td>{product.description}</td>
                    <td>
                        <form onSubmit={e => handleQtyUpdate(e, product.id)}>
                            <input 
                                type="number"
                                name='householdQty'
                                step='0.01'
                                min='0'
                                value={product.householdQty}
                                onChange={e => handleChange(e, product.id)}
                            />
                            <button type="submit">Update Household Qty</button>
                        </form>
                    </td>
                    <td>{product.price}</td>
                    <td>
                        <Link to={`/product/update/${product.id}`}>Update</Link>
                        <button onClick={() => handleDelete(product.id)}>Delete</button>
                    </td>
                    </tr>
                ))
                }
                </tbody>
            </table>
        </>
    )
}