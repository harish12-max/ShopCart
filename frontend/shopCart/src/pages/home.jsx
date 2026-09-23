import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../AxiosCall/axios";
import "../styles/home.css";

const categories = [
    { name: "Home", icon: "🏠" },
    { name: "Electronics", icon: "💻" },
    { name: "Fashion", icon: "👕" },
    { name: "Books", icon: "📚" },
    { name: "Gaming", icon: "🎮" }
];

function Home() {
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const response = await axiosInstance.get("/product/products");
                setFeaturedProducts(response.data.prods.slice(0, 6));
            } catch (error) {
                console.log(error);
            }
        };

        fetchFeaturedProducts();
    }, []);

    return (
        <div className="home-page">
            <main className="home-content">
                <div className="hero-text">
                    <p className="hero-small-text">WELCOME TO SHOPCART</p>
                    <h1>
                        Everything you need,
                        <br />
                        <span>all in one place.</span>
                    </h1>
                    <p className="hero-description">
                        Discover amazing products, explore different
                        categories, and find something that fits your style.
                    </p>
                    <Link to="/products" className="explore-btn">
                        <span>Explore Products</span>
                        <span className="explore-arrow">→</span>
                    </Link>
                </div>

                <div className="hero-visual">
                    <div className="floating-card card-one">🎧</div>
                    <div className="floating-card card-two">⌨️</div>
                    <div className="floating-card card-three">👟</div>
                    <div className="main-shopping-card">
                        <div className="shopping-icon">🛒</div>
                        <h2>
                            Find your next
                            <br />
                            favourite product.
                        </h2>
                        <p>Browse our collection</p>
                        <Link to="/products" className="card-link">
                            View Collection →
                        </Link>
                    </div>
                </div>
            </main>

            <section className="home-section categories-section">
                <div className="section-heading">
                    <div>
                        <p className="section-eyebrow">EXPLORE</p>
                        <h2>Shop by Category</h2>
                        <p>Find products based on what you're looking for.</p>
                    </div>
                    <Link to="/products" className="section-link">
                        View All →
                    </Link>
                </div>

                <div className="category-grid">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            to={"/products?category=" + encodeURIComponent(category.name)}
                            className="category-card"
                        >
                            <span className="category-icon">{category.icon}</span>
                            <span className="category-name">{category.name}</span>
                            <span className="category-arrow">→</span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="home-section featured-section">
                <div className="section-heading">
                    <div>
                        <p className="section-eyebrow">OUR PICKS</p>
                        <h2>Featured Products</h2>
                        <p>A few products from our collection.</p>
                    </div>
                    <Link to="/products" className="section-link">
                        View All →
                    </Link>
                </div>

                {featuredProducts.length > 0 ? (
                    <div className="featured-grid">
                        {featuredProducts.map((product) => (
                            <div className="featured-card" key={product._id}>
                                <div className="featured-image-container">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="featured-image"
                                    />
                                    <span className="featured-category">
                                        {product.category}
                                    </span>
                                </div>

                                <div className="featured-info">
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>

                                    <div className="featured-bottom">
                                        <span className="featured-price">
                                            ₹{product.price}
                                        </span>

                                        <Link
                                            to={"/products/" + product._id}
                                            className="featured-details"
                                        >
                                            View Details →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="featured-empty">
                        <p>No featured products available.</p>
                    </div>
                )}
            </section>

            <section className="about-section" id="about">
                <div className="about-content">
                    <div className="about-main">
                        <p className="section-eyebrow">ABOUT SHOPCART</p>
                        <h2>Simple shopping. Better discovery.</h2>
                        <p>
                            ShopCart is a modern e-commerce platform built to make
                            discovering products simple and convenient. Browse
                            categories, search for products, and explore details
                            from one clean shopping experience.
                        </p>
                    </div>

                    <div className="about-details">
                        <div className="about-item">
                            <span>📍</span>
                            <div>
                                <strong>Location</strong>
                                <p>India</p>
                            </div>
                        </div>

                        <div className="about-item">
                            <span>✉️</span>
                            <div>
                                <strong>Contact</strong>
                                <p>support@shopcart.com</p>
                            </div>
                        </div>

                        <div className="about-item">
                            <span>🛍️</span>
                            <div>
                                <strong>Explore</strong>
                                <p>Products across multiple categories</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="about-bottom">
                    <span>© 2026 ShopCart. All rights reserved.</span>
                    <Link to="/products">Start Shopping →</Link>
                </div>
            </section>

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
