import React, { useState } from "react";
import "../styles/login.css";
import {Link, useNavigate } from "react-router-dom"
import axiosInstance from "../AxiosCall/axios";
import { useAuth } from "../Context/AuthContext";
import AlertMessage from "../components/AlertMessage";

function Login() {
    const [form ,setForm] = useState({email:"",password:""});
    const [loader , setLoader] = useState(false)
    const [error , setError] = useState("")
    const {setUser} = useAuth()

    const navigate = useNavigate()

    const handleChange =(e)=>{
        setForm((prev) =>({...prev , [e.target.name]:e.target.value}))
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()

        if (!form.email.trim() || !form.password.trim()) {
            setError("Please enter both your email and password.")
            return
        }

        setError("")
        setLoader(true)

        try {
            const response = await axiosInstance.post("/user/login" ,form)
            setUser(response.data.user)
            navigate("/home")
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                (error.response?.status === 401
                    ? "Incorrect email or password. Please try again."
                    : error.response?.status === 404
                    ? "Account not found. Please check your email."
                    : "Unable to login right now. Please try again.")

            setError(message)
        } finally {
            setLoader(false)
        }
    }

    return (
        <div className="login-page">
            <div className="login-glow login-blue"></div>
            <div className="login-glow login-purple"></div>
            <div className="login-glow login-cyan"></div>

            <AlertMessage
                type="error"
                message={error}
                onClose={() => setError("")}
            />

            <div className="login-container">
                <div className="login-left">
                    <div className="brand">
                        <div className="brand-logo">🛒</div>
                        <span>ShopCart</span>
                    </div>

                    <div className="welcome-content">
                        <p className="small-title">YOUR SHOPPING JOURNEY STARTS HERE</p>
                        <h1>
                            Shop what you
                            <span> love.</span>
                        </h1>
                        <p className="description">
                            Discover amazing products, exclusive deals and
                            everything you need — all in one place.
                        </p>

                        <div className="shopping-features">
                            <div className="feature">
                                <span>✦</span>
                                <p>Thousands of products</p>
                            </div>
                            <div className="feature">
                                <span>✦</span>
                                <p>Exclusive deals & offers</p>
                            </div>
                            <div className="feature">
                                <span>✦</span>
                                <p>Simple & secure shopping</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="login-card">
                    <div className="card-icon">👋</div>
                    <h2>Welcome Back!</h2>
                    <p className="card-subtitle">
                        Login to continue your shopping journey.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Gmail</label>
                            <input
                                type="email"
                                name="email"
                                autoComplete="new-email"
                                value={form.email}
                                placeholder="Enter your Gmail"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                value={form.password}
                                placeholder="Enter your password"
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            className="login-btn"
                            disabled={loader}
                        >
                            {loader ? "Logging in..." : "Login"}
                            <span>{loader ? "…" : "→"}</span>
                        </button>
                    </form>

                    <div className="divider">
                        <span></span>
                        <p>OR</p>
                        <span></span>
                    </div>

                    <p className="bottom-text">
                        Don't have an account?
                        <Link to="/signup"> Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
