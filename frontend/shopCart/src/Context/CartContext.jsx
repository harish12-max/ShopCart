import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import axiosInstance from "../AxiosCall/axios";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCart = useCallback(async () => {
        try {
            const response = await axiosInstance.get("/cart");
            setCart(response.data.cart || []);
        } catch (error) {
            console.error("Fetch cart error:", error);
            setCart([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = useCallback(async (productId) => {
        const response = await axiosInstance.post(`/cart/${productId}`);
        await fetchCart();
        return response.data;
    }, [fetchCart]);

    const updateQuantity = useCallback(async (productId, quantity) => {
        const response = await axiosInstance.patch(
            `/cart/${productId}`,
            { quantity }
        );
        await fetchCart();
        return response.data;
    }, [fetchCart]);

    const removeFromCart = useCallback(async (productId) => {
        const response = await axiosInstance.delete(`/cart/${productId}`);
        await fetchCart();
        return response.data;
    }, [fetchCart]);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    const totalItems = useMemo(
        () =>
            cart.reduce(
                (total, item) => total + Number(item.quantity || 0),
                0
            ),
        [cart]
    );

    const value = useMemo(
        () => ({
            cart,
            setCart,
            loading,
            totalItems,
            fetchCart,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart
        }),
        [
            cart,
            loading,
            totalItems,
            fetchCart,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart
        ]
    );

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
