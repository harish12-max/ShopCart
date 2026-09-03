import React, { useState } from "react";
import { Link } from "react-router-dom"
import axiosInstance from "../AxiosCall/axios";
import "./signup.css";

function Signup() {
    const [ form, setForm ] = useState({name:"" ,email:"", password:"", phone:""});
    const [ error ,setError] = useState("");
    const [loader , setLoader] = useState(false)

    const handleChange = (e) => {
       setForm((prev) => ({...prev , [e.target.name]:e.target.value}))
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        setError("")
        setLoader(true)

        try {
         await axiosInstance.post("/user/signup" , form)
        console.log("User Registered")

        setForm({
            name:"",
            email:"",
            password:"",
            phone:""
        })
            
        } catch (error) {
            console.log("ERROR:", error);
            console.log("STATUS:", error.response?.status);
            console.log("DATA:", error.response?.data);
            
        }


    }
    return (
        <div className="signup-page">

            {/* Background Glow */}
            <div className="signup-glow signup-blue"></div>
            <div className="signup-glow signup-purple"></div>
            <div className="signup-glow signup-cyan"></div>

            <div className="signup-container">

                {/* SIGNUP CARD */}

                <div className="signup-card">

                    <div className="signup-icon">
                        🛍️
                    </div>

                    <h1>Create Account</h1>

                    <p className="signup-subtitle">
                        Join ShopCart and start your shopping journey.
                    </p>

                    <form>

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
                            onClick={handleSubmit}
                            className="signup-btn"
                        >
                            Create Account
                            <span>→</span>
                        </button>

                    </form>

                    <div className="signup-divider">

                        <span></span>

                        <p>OR</p>

                        <span></span>

                    </div>

                    <p className="login-text">

                        Already have an account?

                        <Link to="/login">
                            {" "}Login
                        </Link>

                    </p>

                </div>

                {/* RIGHT SIDE */}

                <div className="signup-right">

                    <div className="signup-brand">

                        <div className="signup-brand-logo">
                            🛒
                        </div>

                        <span>ShopCart</span>

                    </div>

                    <p className="signup-small-title">
                        EVERYTHING YOU NEED
                    </p>

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

                        <div className="tag">
                            🛍️ Easy Shopping
                        </div>

                        <div className="tag">
                            ⚡ Great Deals
                        </div>

                        <div className="tag">
                            ✨ New Arrivals
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Signup;