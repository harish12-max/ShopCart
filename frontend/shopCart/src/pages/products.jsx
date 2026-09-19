import React, { useState, useEffect } from "react";
import axiosInstance from "../AxiosCall/axios";
import "../styles/product.css";

function Products() {
    const [products, setProducts] = useState([]);

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

            <h1 className="products-title">Products</h1>

            <div className="products-grid">

                {products.map((product) => (
                    <div className="product-card" key={product._id}>

                        <div className="product-image-container">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="product-image"
                            />
                        </div>

                        <div className="product-info">

                            <p className="product-category">
                                {product.category}
                            </p>

                            <h2 className="product-name">
                                {product.name}
                            </h2>

                            <p className="product-price">
                                ₹{product.price}
                            </p>

                            <p className="product-stock">
                                {product.stock} units left
                            </p>

                            <button className="details-button">
                                View Details
                            </button>

                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
}

export default Products;