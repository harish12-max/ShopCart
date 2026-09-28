import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../AxiosCall/axios";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [loading, setLoading] = useState(true);

    const refreshWishlist = async () => {
        try {
            const response = await axiosInstance.get("/wishlist/");
            const items = response.data.wishList || [];

            setWishlistIds(
                new Set(
                    items
                        .map((item) => item?._id?.toString())
                        .filter(Boolean)
                )
            );
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshWishlist();
    }, []);

    const isWishlisted = (productId) =>
        wishlistIds.has(productId?.toString());

    const toggleWishlist = async (productId) => {
        const id = productId?.toString();
        if (!id) return;

        const currentlyWishlisted = isWishlisted(id);

        if (currentlyWishlisted) {
            await axiosInstance.delete(`/wishlist/${id}`);

            setWishlistIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        } else {
            await axiosInstance.post(`/wishlist/${id}`);

            setWishlistIds((prev) => {
                const next = new Set(prev);
                next.add(id);
                return next;
            });
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistIds,
                loading,
                isWishlisted,
                toggleWishlist,
                refreshWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
