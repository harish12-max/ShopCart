import React, { useEffect, useState } from "react";
import axiosInstance from "../AxiosCall/axios";
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

            <div className="wishlist-grid">

                {wishlist.map((product) => (
                    <div className="wishlist-card" key={product._id}>

                        <div className="wishlist-image">
                            <img
                                src={product.image}
                                alt={product.name}
                            />
                        </div>

                        <div className="wishlist-info">
                            <h2>{product.name}</h2>

                            <p className="wishlist-category">
                                {product.category}
                            </p>

                            <p className="wishlist-description">
                                {product.description}
                            </p>

                            <div className="wishlist-bottom">
                                <span className="wishlist-price">
                                    ₹{product.price}
                                </span>

                                <button className="remove-wishlist">
                                    Remove
                                </button>
                            </div>
                        </div>

                    </div>
                ))}

            </div>

            {wishlist.length === 0 && (
                <div className="empty-wishlist">
                    <h2>Your wishlist is empty ❤️</h2>
                    <p>Add some products you love!</p>
                </div>
            )}

        </div>
    );
};

export default WishList;