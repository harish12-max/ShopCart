import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

function Home() {
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
