import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import axiosInstance from "../AxiosCall/axios";
import "../styles/signup.css";
import AlertMessage from "../components/AlertMessage";

function Signup() {
    const [ form, setForm ] = useState({name:"" ,email:"", password:"", phone:""});
    const [ error ,setError] = useState("");
    const [ loader , setLoader] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm((prev) => ({...prev , [e.target.name]:e.target.value}))
    }

    const handleSubmit = async(e) => {
        e.preventDefault()

        if (
            !form.name.trim() ||
            !form.email.trim() ||
            !form.password.trim() ||
            !form.phone.trim()
        ) {
            setError("Please fill in all fields before creating your account.")
            return
        }

        setError("")
        setLoader(true)

        try {
            await axiosInstance.post("/user/signup" , form)
            setError("")
            navigate("/login")
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                (error.response?.status === 409
                    ? "An account with this email already exists."
                    : error.response?.status === 400
                    ? "Please check your details and try again."
                    : "Unable to create your account right now. Please try again.")

            setError(message)
        } finally {
            setLoader(false)
        }
    }

    return (
        <div className="signup-page">
            <div className="signup-glow signup-blue"></div>
            <div className="signup-glow signup-purple"></div>
            <div className="signup-glow signup-cyan"></div>

            <AlertMessage
                type="error"
                message={error}
                onClose={() => setError("")}
            />

            <div className="signup-container">
                <div className="signup-card">
                    <div className="signup-icon">🛍️</div>
                    <h1>Create Account</h1>
                    <p className="signup-subtitle">
                        Join ShopCart and start your shopping journey.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                placeholder="Enter your name"
                                onChange={handleChange}
                            />
                        </div>

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
                                placeholder="Create your password"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                placeholder="Enter your phone number"
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            className="signup-btn"
                            disabled={loader}
                        >
                            {loader ? "Creating account..." : "Create Account"}
                            <span>{loader ? "…" : "→"}</span>
                        </button>
                    </form>

                    <div className="signup-divider">
                        <span></span>
                        <p>OR</p>
                        <span></span>
                    </div>

                    <p className="login-text">
                        Already have an account?
                        <Link to="/login">{" "}Login</Link>
                    </p>
                </div>

                <div className="signup-right">
                    <div className="signup-brand">
                        <div className="signup-brand-logo">🛒</div>
                        <span>ShopCart</span>
                    </div>

                    <p className="signup-small-title">EVERYTHING YOU NEED</p>
                    <h2>
                        Your next
                        <br />
                        <span>favorite thing</span>
                        <br />
                        is waiting.
                    </h2>
                    <p className="signup-description">
                        Create your account and discover a world
                        of products, exciting offers and effortless
                        shopping.
                    </p>

                    <div className="signup-tags">
                        <div className="tag">🛍️ Easy Shopping</div>
                        <div className="tag">⚡ Great Deals</div>
                        <div className="tag">✨ New Arrivals</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
