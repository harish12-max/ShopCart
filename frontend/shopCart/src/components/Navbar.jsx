import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import axiosInstance from "../AxiosCall/axios";
import "../styles/navbar.css";

function Navbar() {
    const { user, setUser } = useAuth();
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
