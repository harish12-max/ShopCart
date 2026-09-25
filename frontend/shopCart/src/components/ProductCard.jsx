import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/productCard.css";
import axiosInstance from "../AxiosCall/axios";


const ProductCard = ({ product, variant = "products", onRemove }) => {
    const navigate = useNavigate();

    const handleDetails = () => {
        navigate(`/products/${product._id}`);
    };


    const handleremove = async() =>{
        try {
            const res =  await axiosInstance.delete(`/wishlist/${product._id}`)
           onRemove(product._id)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <article className={`product-card product-card--${variant}`}>
            <div className="product-card-image-container">
                <img
                    src={product.image}
                    alt={product.name}
                    className="product-card-image"
                />

                <span className="product-card-category-badge">
                    {product.category}
                </span>
            </div>

            <div className="product-card-info">
                <p className="product-card-category">
                    {product.category}
                </p>

                <h2 className="product-card-name">
                    {product.name}
                </h2>

                <p className="product-card-description">
                    {product.description}
                </p>

                <div className="product-card-bottom">
                    <div>
                        <p className="product-card-price-label">Price</p>
                        <p className="product-card-price">
                            ₹{product.price}
                        </p>
                    </div>

                    {variant === "products" && (
                        <div className="product-card-stock">
                            <span
                                className={
                                    product.stock > 0
                                        ? "product-card-stock-dot available"
                                        : "product-card-stock-dot unavailable"
                                }
                            />
                            <span>
                                {product.stock > 0
                                    ? `${product.stock} left`
                                    : "Out of stock"}
                            </span>
                        </div>
                    )}
                </div>

                {variant === "wishlist" ? (
                    <div className="product-card-actions">
                        <button
                            className="product-card-details-button"
                            onClick={handleDetails}
                        >
                            <span>View Details</span>
                            <span className="product-card-arrow">→</span>
                        </button>

                        <button
                            className="product-card-remove-button"
                            onClick={handleremove}
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <button
                        className="product-card-details-button"
                        onClick={handleDetails}
                    >
                        <span>
                            {variant === "featured"
                                ? "View Details"
                                : "View Details"}
                        </span>
                        <span className="product-card-arrow">→</span>
                    </button>
                )}
            </div>
        </article>
    );
};

export default ProductCard;
