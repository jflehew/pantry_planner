import { useState } from "react";
import { useUserAuthContext } from "../context/UserAuthContext";
import { loginUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

export const LoginUser = () => {
    const { user, setUser, loading, setLoading } = useUserAuthContext();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(formData);
            setUser(data);
            setLoading(false);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message || "Login Failed");
            console.log(err.message);
        }
    };

    return (
        <div className="background">
            <div className="form-container">
                <h2>Account Login:</h2>
                <form
                    className="forms"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label> Email:
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            placeholder="Eamil"
                        />
                        </label>
                    </div>
                    <div>
                        <label>Password:
                            <input
                                type="password"
                                name="password"
                                onChange={handleChange}
                                placeholder="Password"
                            />
                        </label>
                    </div>
                    <div className="error-container">
                        {error && <p>{error}</p>}
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};
