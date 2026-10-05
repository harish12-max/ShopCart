import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../AxiosCall/axios";
import { useWishlist } from "../Context/WishlistContext";
import { useCart } from "../Context/CartContext";
import "../styles/productDetails.css";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isWishlisted, toggleWishlist } = useWishlist();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [cartMessage, setCartMessage] = useState("");
    const [error, setError] = useState("");

    const fetchProduct = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axiosInstance.get(`/product/products/${id}`);
            setProduct(response.data.prod);
        } catch (error) {
            console.log(error);
            setProduct(null);
            setError(
                error.response?.status === 404
                    ? "Product not found."
                    : "Unable to load this product right now. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleWishlistToggle = async () => {
        try {
            await toggleWishlist(id);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddToCart = async () => {
        if (!product || product.stock <= 0 || addingToCart) return;

        setAddingToCart(true);
        setCartMessage("");

        try {
            await addToCart(product._id);
            setCartMessage("Added to cart successfully.");
        } catch (error) {
            console.log(error);
            setCartMessage(
                error.response?.data?.message ||
                "Unable to add this product to cart."
            );
        } finally {
            setAddingToCart(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="product-details-loading">
                <div className="loader"></div>
                <p>Loading product...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-not-found">
                <h2>{error || "Product not found"}</h2>
                <button onClick={() => navigate("/products")}>
                    Back to Products
                </button>
            </div>
        );
    }

    const wishlisted = isWishlisted(id);

    return (
        <div className="product-details-page">
            <button
                className="back-button"
                onClick={() => navigate("/products")}
            >
                ← Back to Products
            </button>

            <div className="product-details-card">
                <div className="product-details-image-section">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-details-image"
                    />
                </div>

                <div className="product-details-info">
                    <span className="product-details-category">
                        {product.category}
                    </span>

                    <h1 className="product-details-name">{product.name}</h1>

                    <p className="product-details-description">
                        {product.description}
                    </p>

                    <div className="product-details-price">
                        ₹{product.price.toLocaleString("en-IN")}
                    </div>

                    <div className="product-details-divider"></div>

                    <div className="product-details-stock">
                        <span className="stock-label">Availability</span>
                        <span
                            className={
                                product.stock > 0
                                    ? "stock-available"
                                    : "stock-out"
                            }
                        >
                            {product.stock > 0
                                ? `${product.stock} units available`
                                : "Out of stock"}
                        </span>
                    </div>

                    {cartMessage && (
                        <p
                            className={
                                cartMessage.includes("successfully")
                                    ? "cart-action-message success"
                                    : "cart-action-message error"
                            }
                        >
                            {cartMessage}
                        </p>
                    )}

                    <div className="product-details-actions">
                        <button
                            className="buy-button product-cart-button"
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0 || addingToCart}
                        >
                            {addingToCart
                                ? "Adding..."
                                : product.stock <= 0
                                    ? "Out of Stock"
                                    : "Add to Cart"}
                        </button>

                        <button
                            onClick={handleWishlistToggle}
                            className={`buy-button product-wishlist-button ${wishlisted ? "is-added" : ""}`}
                        >
                            <span className="wishlist-details-heart">
                                {wishlisted ? "♥" : "♡"}
                            </span>
                            {wishlisted ? "Added to Wishlist" : "Wishlist"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
