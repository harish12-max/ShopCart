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

    const addToCart = useCallback(async (productId, productData) => {
        const response = await axiosInstance.post(`/cart/${productId}`);

        if (!productData?._id) {
            await fetchCart();
            return response.data;
        }

        setCart((currentCart) => {
            const existing = currentCart.find(
                (item) => item?.product?._id?.toString() === productId.toString()
            );

            if (existing) {
                return currentCart.map((item) =>
                    item?.product?._id?.toString() === productId.toString()
                        ? { ...item, quantity: Number(item.quantity || 0) + 1 }
                        : item
                );
            }

            return [...currentCart, { product: productData, quantity: 1 }];
        });

        return response.data;
    }, [fetchCart]);

    const updateQuantity = useCallback(async (productId, quantity) => {
        const response = await axiosInstance.patch(
            `/cart/${productId}`,
            { quantity }
        );

        setCart((currentCart) =>
            currentCart.map((item) =>
                item?.product?._id?.toString() === productId.toString()
                    ? { ...item, quantity }
                    : item
            )
        );

        return response.data;
    }, []);

    const removeFromCart = useCallback(async (productId) => {
        const response = await axiosInstance.delete(`/cart/${productId}`);

        setCart((currentCart) =>
            currentCart.filter(
                (item) => item?.product?._id?.toString() !== productId.toString()
            )
        );

        return response.data;
    }, []);

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
