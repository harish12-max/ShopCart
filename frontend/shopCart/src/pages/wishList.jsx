import React, { useEffect, useState } from "react";
import axiosInstance from "../AxiosCall/axios";
import ProductCard from "../components/ProductCard";
import "../styles/wishlist.css";

const WishList = () => {
    const [wishlist, setWishList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchList = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axiosInstance.get("/wishlist/");
            setWishList(response.data.wishList || []);
        } catch (error) {
            console.log(error);
            setWishList([]);
            setError("Unable to load your wishlist right now. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className="wishlist-page">
            <div className="wishlist-header">
                <h1>My Wishlist</h1>
                <p>{wishlist.length} items saved</p>
            </div>

            {loading ? (
                <div className="wishlist-state">
                    <div className="wishlist-loader"></div>
                    <p>Loading your wishlist...</p>
                </div>
            ) : error ? (
                <div className="wishlist-state wishlist-state--error">
                    <h2>Something went wrong</h2>
                    <p>{error}</p>
                </div>
            ) : wishlist.length > 0 ? (
                <div className="wishlist-grid">
                    {wishlist.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            variant="wishlist"
                            onRemove={(productId) => {
                                setWishList(prev =>
                                    prev.filter(item => item._id !== productId)
                                );
                            }}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-wishlist">
                    <h2>Your wishlist is empty ❤️</h2>
                    <p>Add some products you love!</p>
                </div>
            )}
        </div>
    );
};

export default WishList;
