import React, { useState } from "react";
import "./login.css";
import {Link, useNavigate } from "react-router-dom"
import axiosInstance from "../AxiosCall/axios";

function Login() {
    const [form ,setForm] = useState({email:"",password:""});
    const [loader , setLoader] = useState("")
    const [error , setError] = useState(false)

    const navigate = useNavigate()

    const handleChange =(e)=>{
     setForm((prev) =>({...prev , [e.target.name]:e.target.value}))
    }

    const handleSubmit =async(e)=>{
        e.preventDefault()
        setError("")
        setLoader(true)
        

        try {
         await axiosInstance.post("/user/login" ,form)
         console.log("User Login")
         navigate("/home")
            
        } catch (error) {
            console.log(error)
        }
       
    }
  return (
    <div className="login-page">

      {/* Background Glow */}
      <div className="login-glow login-blue"></div>
      <div className="login-glow login-purple"></div>
      <div className="login-glow login-cyan"></div>

      <div className="login-container">

        {/* LEFT SIDE */}
        <div className="login-left">

          <div className="brand">
            <div className="brand-logo">
              🛒
            </div>

            <span>ShopCart</span>
          </div>

          <div className="welcome-content">

            <p className="small-title">
              YOUR SHOPPING JOURNEY STARTS HERE
            </p>

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

        {/* LOGIN CARD */}
        <div className="login-card">

          <div className="card-icon">
            👋
          </div>

          <h2>Welcome Back!</h2>

          <p className="card-subtitle">
            Login to continue your shopping journey.
          </p>

          <form>

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
                placeholder="Enter your password"
                onChange={handleChange}
              />

            </div>

            <button
              type="submit"
              className="login-btn"
              onClick={handleSubmit}
            >
              Login
              <span>→</span>
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