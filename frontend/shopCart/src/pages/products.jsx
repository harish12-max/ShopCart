import React, { useState, useEffect } from "react";
import axiosInstance from "../AxiosCall/axios";
import "../styles/product.css";
import { useNavigate } from "react-router-dom";

function Products() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const response = await axiosInstance.get("/product/products");
            setProducts(response.data.prods);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="products-page">

            {/* Header */}
            <div className="products-header">
                <div>
                    <p className="products-eyebrow">OUR COLLECTION</p>

                    <h1 className="products-title">
                        Explore Products
                    </h1>

                    <p className="products-subtitle">
                        Discover products carefully selected for you.
                    </p>
                </div>

                <div className="products-count">
                    <span>{products.length}</span>
                    <p>Products</p>
                </div>
            </div>

            {/* Products */}
            <div className="products-grid">

                {products.map((product) => (
                    <div className="product-card" key={product._id}>

                        {/* Image */}
                        <div className="product-image-container">

                            <img
                                src={product.image}
                                alt={product.name}
                                className="product-image"
                            />

                            <span className="category-badge">
                                {product.category}
                            </span>

                        </div>

                        {/* Info */}
                        <div className="product-info">

                            <p className="product-category">
                                {product.category}
                            </p>

                            <h2 className="product-name">
                                {product.name}
                            </h2>

                            <p className="product-description">
                                {product.description}
                            </p>

                            <div className="product-bottom">

                                <div>
                                    <p className="price-label">
                                        Price
                                    </p>

                                    <p className="product-price">
                                        ₹{product.price}
                                    </p>
                                </div>

                                <div className="stock-container">

                                    <span
                                        className={
                                            product.stock > 0
                                                ? "stock-dot available"
                                                : "stock-dot unavailable"
                                        }
                                    ></span>

                                    <span className="product-stock">
                                        {product.stock > 0
                                            ? `${product.stock} left`
                                            : "Out of stock"}
                                    </span>

                                </div>

                            </div>

                            <button
                                className="details-button"
                                onClick={() =>
                                    navigate(`/products/${product._id}`)
                                }
                            >
                                <span>View Details</span>
                                <span className="arrow">→</span>
                            </button>

                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
}

export default Products;