import { useState, useEffect } from "react";
import { useUserAuthContext } from "../context/UserAuthContext";
import ClipLoader from "react-spinners/Cliploader";
import { useNavigate } from "react-router-dom";
import { deleteGroceryList, getGroceryList, updateProductPurchase } from "../services/groceryListService";

export const GroceryList = () =>{
    const navigate = useNavigate()
    const {user} = useUserAuthContext()
    const [groceryList, setGroceryList] = useState([])
    const [loading, setLoading] = useState(false)

    const getCurrentGroceryList = async () => {
        setLoading(true)
        try{
            const res = await getGroceryList()
            setGroceryList(res)
        } catch (err){
            console.error(err)
        }finally{
            setLoading(false)
        }
    }
    useEffect(() => {
        getCurrentGroceryList()
    }, [])

    const handlePurchaseChange = async (id) => {
        try{
            await updateProductPurchase(id)
            getCurrentGroceryList()
        } catch (err){
            console.error(err)
        }
    }
    const handleShopping = async () => {
        try{
            await deleteGroceryList()
            navigate('/dashboard')
        } catch (err){
            console.error()
        }
    }
    return (
    <div>
        <h2>{user.firstName} {user.lastName}'s Grocery List!</h2>
        <table>
            <thead>
                <tr>
                    <td>Image:</td>
                    <td>Product Name:</td>
                    <td>Description:</td>
                    <td>Purchase Quantity:</td>
                    <td>price:</td>
                    <td>Do Not Purchase this session:</td>
                </tr>
            </thead>
            <tbody>
                {groceryList.length === 0 
                ?<tr>
                    <td>You're grocery list is empty! You have a well stocked pantry!</td>
                </tr>
                : groceryList.filter(item => item.productPurchased).map( item =>(
                <tr key={item.id}>
                    <td><img src={item.product.image} alt={item.product.productName} style={{width: "50px"}} /></td>
                    <td>{item.product.productName}</td>
                    <td>{item.product.description}</td>
                    <td>{item.product.purchaseQty}</td>
                    <td>{item.product.price}</td>
                    <td><button onClick={() => handlePurchaseChange(item.id)}>Don't purchase</button></td>
                </tr>
                ))}
                <tr>
                    <td colSpan='4'>Your subtotal:</td>
                    <td>
                    {
                    groceryList.filter(item => item.productPurchased)
                    .reduce((sum, item) => sum + item.product.price, 0)
                    .toFixed(2)
                    }</td>
                    <td><button onClick={handleShopping}>Finish Shopping</button></td>
                </tr>
            </tbody>
        </table>
        <h2>Items you don't plan on purchasing this shoping session!</h2>
        <table>
            <thead>
                <tr>
                    <td>Image:</td>
                    <td>Product Name:</td>
                    <td>Description:</td>
                    <td>Purchase Quantity:</td>
                    <td>price:</td>
                    <td>Do Not Purchase this session:</td>
                </tr>
            </thead>
            <tbody>
                
                {groceryList.length === 0 
                ?<tr>
                    <td>You're grocery list is empty! You have a well stocked pantry!</td>
                </tr>
                : groceryList.filter(item => !item.productPurchased).map(item =>(
                <tr key={item.id}>
                    <td><img src={item.product.image} alt={item.product.productName} style={{width: "50px"}} /></td>
                    <td>{item.product.productName}</td>
                    <td>{item.product.description}</td>
                    <td>{item.product.purchaseQty}</td>
                    <td>{item.product.price}</td>
                    <td><button onClick={() => handlePurchaseChange(item.id)}>Purchase</button></td>
                </tr>
                ))}
            </tbody>
        </table>
    </div>
    )
}