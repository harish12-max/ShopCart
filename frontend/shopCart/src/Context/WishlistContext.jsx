import { createContext, useCallback, useContext, useEffect, useState } from "react";
import axiosInstance from "../AxiosCall/axios";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const userId = user?._id?.toString() || null;

    const refreshWishlist = useCallback(async () => {
        if (authLoading) return;

        if (!userId) {
            setWishlistIds(new Set());
            setLoading(false);
            return;
        }

        setLoading(true);
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
            console.error("Fetch wishlist error:", error);
            setWishlistIds(new Set());
        } finally {
            setLoading(false);
        }
    }, [authLoading, userId]);

    useEffect(() => {
        refreshWishlist();
    }, [refreshWishlist]);

    const isWishlisted = (productId) =>
        wishlistIds.has(productId?.toString());

    const toggleWishlist = async (productId) => {
        const id = productId?.toString();
        if (!id || !userId || authLoading) return;

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
                loading: authLoading || loading,
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
