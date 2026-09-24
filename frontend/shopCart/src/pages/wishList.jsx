import React, { useEffect, useState } from "react";
import axiosInstance from "../AxiosCall/axios";
import ProductCard from "../components/ProductCard";
import "../styles/wishlist.css";

const WishList = () => {
    const [wishlist, setWishList] = useState([]);

    const fetchList = async () => {
        try {
            const response = await axiosInstance.get("/wishlist/");
            setWishList(response.data.wishList);
        } catch (error) {
            console.log(error);
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

            {wishlist.length > 0 ? (
                <div className="wishlist-grid">
                    {wishlist.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            variant="wishlist"
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
