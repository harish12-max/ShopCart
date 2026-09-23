import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import axiosInstance from "../AxiosCall/axios";
import "../styles/navbar.css";

function Navbar() {
    const { user, setUser } = useAuth();
    const [search, setSearch] = useState("")
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/user/logout");
        } catch (error) {
            console.log(error);
        } finally {
            setUser(null);
            navigate("/login", { replace: true });
        }
    };



    const handlechange = (e) => {
        setSearch(e.target.value)
        //   console.log(e.target.value)
    }


    const handlesubmit = async (e) => {
        e.preventDefault()

        if (!search.trim()) return;

        try {
            navigate(`/products?search=${encodeURIComponent(search.trim())}`);
            // if (response.data.prods.length === 0) {
            //     console.log("No such product available");
            // }

        } catch (error) {
            console.log(error);
        }
    }

    const profileName =
        user?.name ||
        user?.email?.split("@")[0] ||
        "Account";

    return (
        <nav className="app-navbar">
            <Link to="/home" className="navbar-brand">
                <span className="brand-icon">🛍️</span>
                <span className="brand-name">ShopCart</span>
            </Link>

            <div className="navbar-links">
                <Link
                    to="/home"
                    className={location.pathname === "/home" ? "nav-link active" : "nav-link"}
                >
                    Home
                </Link>

                <Link
                    to="/products"
                    className={location.pathname.startsWith("/products") ? "nav-link active" : "nav-link"}
                >
                    Products
                </Link>
            </div>


            <form className="navbar-search" onSubmit={handlesubmit}>

                <input
                    type="text"
                    placeholder="Search products..."
                    name="search"
                    value={search}
                    onChange={handlechange}
                />

                <button type="submit" className="search-button">
                    <span className="search-icon">⌕</span>
                </button>

            </form>

            <div className="navbar-profile">
                <div className="profile-info">
                    <span className="profile-avatar">
                        {profileName.charAt(0).toUpperCase()}
                    </span>

                    <div className="profile-text">
                        <span className="profile-label">Signed in as</span>
                        <span className="profile-name">{profileName}</span>
                    </div>
                </div>

                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
