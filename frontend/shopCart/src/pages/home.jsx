import React from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../AxiosCall/axios";
import "../styles/home.css";

function Home() {
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/user/logout");
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="home-page">

            {/* Navbar */}
            <nav className="home-navbar">

                {/* Logo */}
                <div className="navbar-left">

                    <div className="brand-icon">
                        🛍️
                    </div>

                    <span className="brand-name">
                        ShopCart
                    </span>

                    <Link
                        to="/home"
                        className="nav-home active"
                    >
                        Home
                    </Link>

                </div>

                {/* Right Side */}
                <div className="navbar-right">

                    <Link
                        to="/products"
                        className="nav-products"
                    >
                        Products
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="logout-btn"
                    >
                        Logout
                    </button>

                </div>

            </nav>


            {/* Hero Section */}
            <main className="home-content">

                <div className="hero-text">

                    <p className="hero-small-text">
                        WELCOME TO SHOPCART
                    </p>

                    <h1>
                        Everything you need,
                        <br />
                        <span>all in one place.</span>
                    </h1>

                    <p className="hero-description">
                        Discover amazing products, explore different
                        categories, and find something that fits your style.
                    </p>

                    <Link
                        to="/products"
                        className="explore-btn"
                    >
                        <span>Explore Products</span>
                        <span className="explore-arrow">→</span>
                    </Link>

                </div>


                {/* Decorative Product Card */}
                <div className="hero-visual">

                    <div className="floating-card card-one">
                        🎧
                    </div>

                    <div className="floating-card card-two">
                        ⌨️
                    </div>

                    <div className="floating-card card-three">
                        👟
                    </div>

                    <div className="main-shopping-card">

                        <div className="shopping-icon">
                            🛒
                        </div>

                        <h2>
                            Find your next
                            <br />
                            favourite product.
                        </h2>

                        <p>
                            Browse our collection
                        </p>

                        <Link
                            to="/products"
                            className="card-link"
                        >
                            View Collection →
                        </Link>

                    </div>

                </div>

            </main>


            {/* Bottom Features */}
            <section className="features">

                <div className="feature">
                    <span>✦</span>
                    <div>
                        <strong>Wide Selection</strong>
                        <p>Explore different products</p>
                    </div>
                </div>

                <div className="feature">
                    <span>✓</span>
                    <div>
                        <strong>Easy Shopping</strong>
                        <p>Simple and convenient</p>
                    </div>
                </div>

                <div className="feature">
                    <span>⚡</span>
                    <div>
                        <strong>Discover More</strong>
                        <p>Find products you love</p>
                    </div>
                </div>

            </section>

        </div>
    );
}

export default Home;