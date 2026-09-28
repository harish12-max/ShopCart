import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/productCard.css";
import { useWishlist } from "../Context/WishlistContext";

const ProductCard = ({ product, variant = "products", onRemove }) => {
    const navigate = useNavigate();
    const { isWishlisted, toggleWishlist } = useWishlist();
    const wishlisted = isWishlisted(product._id);

    const handleDetails = () => {
        navigate(`/products/${product._id}`);
    };

    const handleWishlistToggle = async () => {
        try {
            await toggleWishlist(product._id);

            if (wishlisted && onRemove) {
                onRemove(product._id);
            }
        } catch (error) {
            console.log(error);
        }
    };

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
                <div className="product-card-category-row">
                    <p className="product-card-category">{product.category}</p>

                    {variant !== "wishlist" && (
                        <button
                            type="button"
                            className={`product-card-wishlist-button ${wishlisted ? "is-added" : ""}`}
                            onClick={handleWishlistToggle}
                        >
                            <span className="wishlist-heart">
                                {wishlisted ? "♥" : "♡"}
                            </span>
                            <span>
                                {wishlisted ? "Added to Wishlist" : "Wishlist"}
                            </span>
                        </button>
                    )}
                </div>

                <h2 className="product-card-name">{product.name}</h2>

                <p className="product-card-description">
                    {product.description}
                </p>

                <div className="product-card-bottom">
                    <div>
                        <p className="product-card-price-label">Price</p>
                        <p className="product-card-price">₹{product.price}</p>
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
                            onClick={handleWishlistToggle}
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <button
                        className="product-card-details-button"
                        onClick={handleDetails}
                    >
                        <span>View Details</span>
                        <span className="product-card-arrow">→</span>
                    </button>
                )}
            </div>
        </article>
    );
};

export default ProductCard;
