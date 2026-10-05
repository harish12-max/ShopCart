import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../AxiosCall/axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        try {
            const response = await axiosInstance.get("/cart");
            setCart(response.data.cart || []);
        } catch (error) {
            console.log("Fetch cart error:", error);
            setCart([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const addToCart = async (productId) => {
        const response = await axiosInstance.post(`/cart/${productId}`);
        await fetchCart();
        return response.data;
    };

    const updateQuantity = async (productId, quantity) => {
        const response = await axiosInstance.patch(`/cart/${productId}`, {
            quantity
        });
        await fetchCart();
        return response.data;
    };

    const removeFromCart = async (productId) => {
        const response = await axiosInstance.delete(`/cart/${productId}`);
        await fetchCart();
        return response.data;
    };

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                setCart,
                loading,
                totalItems,
                fetchCart,
                addToCart,
                updateQuantity,
                removeFromCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
