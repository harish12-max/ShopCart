import { createContext, useCallback, useContext, useEffect, useState } from "react";
import axiosInstance from "../AxiosCall/axios";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const userId = user?._id?.toString() || null;

    const refreshWishlist = useCallback(async () => {
        if (authLoading) return;

        if (!userId) {
            setWishlistIds(new Set());
            setWishlistProducts([]);
            setError("");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");
        try {
            const response = await axiosInstance.get("/wishlist/");
            const items = response.data.wishList || [];

            setWishlistProducts(items);
            setWishlistIds(
                new Set(
                    items
                        .map((item) => item?._id?.toString())
                        .filter(Boolean)
                )
            );
        } catch (requestError) {
            console.error("Fetch wishlist error:", requestError);
            setError("Unable to load your wishlist right now. Please try again.");
            setWishlistIds(new Set());
            setWishlistProducts([]);
        } finally {
            setLoading(false);
        }
    }, [authLoading, userId]);

    useEffect(() => {
        refreshWishlist();
    }, [refreshWishlist]);

    const isWishlisted = (productId) =>
        wishlistIds.has(productId?.toString());

    const toggleWishlist = async (productId, productData = null) => {
        const id = productId?.toString();
        if (!id || !userId || authLoading) return;

        const currentlyWishlisted = isWishlisted(id);

        if (currentlyWishlisted) {
            await axiosInstance.delete(`/wishlist/${id}`);
            setWishlistIds((previous) => {
                const next = new Set(previous);
                next.delete(id);
                return next;
            });
            setWishlistProducts((previous) =>
                previous.filter((item) => item?._id?.toString() !== id)
            );
        } else {
            await axiosInstance.post(`/wishlist/${id}`);
            setWishlistIds((previous) => new Set([...previous, id]));
            if (productData?._id) {
                setWishlistProducts((previous) =>
                    previous.some((item) => item?._id?.toString() === id)
                        ? previous
                        : [...previous, productData]
                );
            } else {
                await refreshWishlist();
            }
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistIds,
                wishlistProducts,
                loading: authLoading || loading,
                error,
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
