import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { formatMoney } from "../utils/formatters";
import "../styles/cart.css";

const Cart = () => {
    const navigate = useNavigate();
    const {
        cart,
        loading,
        updateQuantity,
        removeFromCart
    } = useCart();

    const [actionId, setActionId] = useState(null);
    const [error, setError] = useState("");

    const validItems = useMemo(
        () => cart.filter((item) => item?.product),
        [cart]
    );

    const totalItems = useMemo(
        () =>
            validItems.reduce(
                (total, item) => total + Number(item.quantity || 0),
                0
            ),
        [validItems]
    );

    const subtotal = useMemo(
        () =>
            validItems.reduce(
                (total, item) =>
                    total +
                    Number(item.product.price || 0) *
                        Number(item.quantity || 0),
                0
            ),
        [validItems]
    );

    const handleQuantity = async (productId, quantity) => {
        setError("");
        setActionId(productId);

        try {
            await updateQuantity(productId, quantity);
        } catch (requestError) {
            console.error(requestError);
            setError(
                requestError.response?.data?.message ||
                "Unable to update cart quantity."
            );
        } finally {
            setActionId(null);
        }
    };

    const handleRemove = async (productId) => {
        setError("");
        setActionId(productId);

        try {
            await removeFromCart(productId);
        } catch (requestError) {
            console.error(requestError);
            setError(
                requestError.response?.data?.message ||
                "Unable to remove product from cart."
            );
        } finally {
            setActionId(null);
        }
    };

    if (loading) {
        return (
            <div className="cart-page">
                <div className="cart-state">
                    <div className="cart-loader"></div>
                    <p>Loading your cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-header">
                <div>
                    <p className="cart-eyebrow">SHOPPING CART</p>
                    <h1>My Cart</h1>
                    <p>Review your products before checkout.</p>
                </div>

                <button
                    className="cart-continue-button"
                    type="button"
                    onClick={() => navigate("/products")}
                >
                    Continue Shopping
                </button>
            </div>

            {error && (
                <div className="cart-error" role="alert">
                    {error}
                </div>
            )}

            {validItems.length === 0 ? (
                <div className="empty-cart">
                    <div className="empty-cart-icon">🛒</div>
                    <h2>Your cart is empty</h2>
                    <p>
                        Add products to your cart and they will appear here.
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate("/products")}
                    >
                        Browse Products
                    </button>
                </div>
            ) : (
                <div className="cart-layout">
                    <section className="cart-items" aria-label="Cart items">
                        {validItems.map((item) => {
                            const product = item.product;
                            const quantity = Number(item.quantity || 0);
                            const price = Number(product.price || 0);
                            const stock = Number(product.stock || 0);
                            const itemTotal = price * quantity;
                            const busy = actionId === product._id;

                            return (
                                <article
                                    className="cart-item"
                                    key={product._id}
                                >
                                    <div className="cart-item-image">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                        />
                                    </div>

                                    <div className="cart-item-details">
                                        <span className="cart-item-category">
                                            {product.category}
                                        </span>

                                        <h2>{product.name}</h2>

                                        <p className="cart-item-price">
                                            {formatMoney(price)}
                                        </p>

                                        <div className="cart-item-footer">
                                            <div
                                                className="quantity-control"
                                                aria-label={
                                                    "Quantity for " +
                                                    product.name
                                                }
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleQuantity(
                                                            product._id,
                                                            quantity - 1
                                                        )
                                                    }
                                                    disabled={
                                                        busy || quantity <= 1
                                                    }
                                                    aria-label={
                                                        "Decrease " +
                                                        product.name +
                                                        " quantity"
                                                    }
                                                >
                                                    −
                                                </button>

                                                <span>{quantity}</span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleQuantity(
                                                            product._id,
                                                            quantity + 1
                                                        )
                                                    }
                                                    disabled={
                                                        busy ||
                                                        quantity >= stock
                                                    }
                                                    aria-label={
                                                        "Increase " +
                                                        product.name +
                                                        " quantity"
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                className="cart-remove-button"
                                                type="button"
                                                onClick={() =>
                                                    handleRemove(product._id)
                                                }
                                                disabled={busy}
                                            >
                                                {busy
                                                    ? "Updating..."
                                                    : "Remove"}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="cart-item-total">
                                        {formatMoney(itemTotal)}
                                    </div>
                                </article>
                            );
                        })}
                    </section>

                    <aside className="cart-summary">
                        <p className="summary-eyebrow">ORDER SUMMARY</p>
                        <h2>Summary</h2>

                        <div className="summary-row">
                            <span>Items</span>
                            <span>{totalItems}</span>
                        </div>

                        <div className="summary-row summary-subtotal">
                            <span>Subtotal</span>
                            <strong>{formatMoney(subtotal)}</strong>
                        </div>

                        <div className="summary-divider"></div>

                        <p className="summary-note">
                            Taxes and delivery charges will be calculated at
                            checkout.
                        </p>

                        <button
                            className="checkout-button"
                            type="button"
                            onClick={() => navigate("/checkout")}
                        >
                            Proceed to Checkout
                        </button>
                    </aside>
                </div>
            )}
        </div>
    );
};

export default Cart;
