import React, { useState, useEffect } from "react";
import axiosInstance from "../AxiosCall/axios";
import "../styles/product.css";
import ProductCard from "../components/ProductCard";
import { useSearchParams } from "react-router-dom";

function Products() {
    const [products, setProducts] = useState([]);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("search");
    const categoryQuery = searchParams.get("category");

    const fetchProducts = async () => {
        let response;

        try {
            if (searchQuery || categoryQuery) {
                response = await axiosInstance.get("/product/search", {
                    params: {
                        search: searchQuery,
                        category: categoryQuery
                    }
                });
            } else {
                response = await axiosInstance.get("/product/products");
            }

            setProducts(response.data.prods);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [searchQuery, categoryQuery]);

    return (
        <div className="products-page">
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

            {products.length === 0 ? (
                <div className="no-products">
                    <h2>No product available</h2>
                    <p>Try searching for a different product.</p>
                </div>
            ) : (
                <div className="products-grid">
                    {products.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            variant="products"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Products;
