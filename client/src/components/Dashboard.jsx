import { useState, useEffect } from "react";
import { useUserAuthContext } from "../context/UserAuthContext";
import {
    getAllProducts,
    deleteProduct,
    updateProductQty,
} from "../services/productService";
import { getGroceryList } from "../services/groceryListService";
import ClipLoader from "react-spinners/Cliploader";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { addAllToList, addOneToList } from "../services/groceryListService";

export const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useUserAuthContext();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [groceryList, setGroceryList] = useState([]);
    const [error, setError] = useState({})

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await getAllProducts();
            setProducts(res);
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    const fetchGroceryList = async () => {
        setLoading(true);
        try {
            const res = await getGroceryList();
            setGroceryList(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchGroceryList();
        const addAllToGroceryList = async () => {
            try {
                await addAllToList();
            } catch (err) {
                console.error(err);
            }
        };
        addAllToGroceryList();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteProduct(id);
        } catch (err) {
            console.error(err);
        } finally {
            fetchProducts();
        }
    };
    const handleQtyUpdate = async (e, id) => {
        e.preventDefault();
        const updatedProduct = products.find((product) => product.id === id);
        try {
            const res = await updateProductQty(updatedProduct);
            fetchProducts();
        } catch (err) {
            setError(err)
            console.error(err);
        }
    };
    const handleChange = (e, id) => {
        const { name, value } = e.target;
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === id ? { ...product, [name]: value } : product,
            ),
        );
    };
    const addOneToGroceryList = async (id) => {
        try {
            await addOneToList(id);
            fetchGroceryList();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="background">
        <h2 className="text-4xl text-center font-organic mb-6 underline text-clay mt-8">Your Pantry</h2>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <td>Image:</td>
                            <td>Product Name:</td>
                            <td>Description:</td>
                            <td>Quantity remaining:</td>
                            <td>Price:</td>
                            <td>Edit/Remove:</td>
                            <td>Add to grocery list:</td>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td
                                    colSpan="6"
                                    style={{
                                        height: "100px",
                                        textAlign: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: "100%",
                                        }}
                                    >
                                        <ClipLoader
                                            color="#4a90e2"
                                            size={50}
                                        />
                                    </div>
                                </td>
                            </tr>
                        )}
                        {products.length === 0 && !loading && (
                            <tr>
                                <td colSpan="5">
                                    You don't have any products in your pantry
                                </td>
                            </tr>
                        )}
                        {products.length > 0 &&
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td >
                                        <div className="flex items-center justify-center w-full h-full">
                                            <img
                                                className="rounded-full"
                                                style={{ width: "75px", height: "75px" }}
                                                src={product.image}
                                                alt={product.description}
                                            />
                                        </div>
                                    </td>
                                    <td>{product.productName}</td>
                                    <td>{product.description}</td>
                                    <td>
                                        <form
                                            onSubmit={(e) =>
                                                handleQtyUpdate(e, product.id)
                                            }
                                        >
                                            <input
                                                type="number"
                                                name="householdQty"
                                                step="0.01"
                                                min="0"
                                                value={product.householdQty}
                                                onChange={(e) =>
                                                    handleChange(e, product.id)
                                                }
                                            />
                                            <button type="submit">
                                                Update Household Qty
                                            </button>
                                            <div className="error-container">
                                                {error && <p>{error.message}</p>}
                                            </div>
                                        </form>
                                    </td>
                                    <td>{product.price}</td>
                                    <td>
                                        <Link className="underline m-2"
                                            to={`/product/update/${product.id}`}
                                        >
                                            Update
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleDelete(product.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>
                                    <td>
                                        {!groceryList.some(
                                            (item) =>
                                                item.product.id === product.id,
                                        ) ? (
                                            <button
                                                onClick={() =>
                                                    addOneToGroceryList(
                                                        product.id,
                                                    )
                                                }
                                            >
                                                Add to Grocery List
                                            </button>
                                        ) : (
                                            <span style={{ color: "gray" }}>
                                                Already added
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
