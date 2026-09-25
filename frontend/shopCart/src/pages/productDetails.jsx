import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../AxiosCall/axios";
import "../styles/productDetails.css";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
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

    const handleadd = async() =>{
        try {
          await axiosInstance.post(`/wishlist/${id}`)
  
        } catch (error) {
            console.log(error)
        }
    }

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

    return (
        <div className="product-details-page">

            <button
                className="back-button"
                onClick={() => navigate("/products")}
            >
                ← Back to Products
            </button>

            <div className="product-details-card">

                {/* Product Image */}
                <div className="product-details-image-section">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-details-image"
                    />
                </div>

                {/* Product Information */}
                <div className="product-details-info">

                    <span className="product-details-category">
                        {product.category}
                    </span>

                    <h1 className="product-details-name">
                        {product.name}
                    </h1>

                    <p className="product-details-description">
                        {product.description}
                    </p>

                    <div className="product-details-price">
                        ₹{product.price}
                    </div>

                    <div className="product-details-divider"></div>

                    <div className="product-details-stock">
                        <span className="stock-label">
                            Availability
                        </span>

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

                    <div className="product-details-actions">
                        <button className="buy-button product-cart-button">
                            Add to Cart
                        </button>

                        <button
                            onClick={handleadd}
                            className="buy-button product-wishlist-button"
                        >
                            Wishlist
                        </button>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default ProductDetails;