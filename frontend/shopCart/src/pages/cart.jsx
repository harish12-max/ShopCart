import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import "../styles/cart.css";

const Cart = () => {
    const navigate = useNavigate();
    const {
        cart,
        loading,
        updateQuantity,
        removeFromCart
    } = useCart();

    const [actionId, setActionId] = React.useState(null);
    const [error, setError] = React.useState("");

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const subtotal = cart.reduce(
        (total, item) =>
            total + (item.product?.price || 0) * item.quantity,
        0
    );

    const handleQuantity = async (productId, quantity) => {
        setError("");
        setActionId(productId);

        try {
            await updateQuantity(productId, quantity);
        } catch (error) {
            console.log(error);
            setError(
                error.response?.data?.message ||
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
        } catch (error) {
            console.log(error);
            setError(
                error.response?.data?.message ||
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
                    onClick={() => navigate("/products")}
                >
                    Continue Shopping
                </button>
            </div>

            {error && <div className="cart-error">{error}</div>}

            {cart.length === 0 ? (
                <div className="empty-cart">
                    <div className="empty-cart-icon">🛒</div>
                    <h2>Your cart is empty</h2>
                    <p>Add products to your cart and they will appear here.</p>
                    <button onClick={() => navigate("/products")}>
                        Browse Products
                    </button>
                </div>
            ) : (
                <div className="cart-layout">
                    <section className="cart-items">
                        {cart.map((item) => {
                            const product = item.product;

                            if (!product) {
                                return null;
                            }

                            const itemTotal = product.price * item.quantity;
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
                                            ₹{product.price.toLocaleString("en-IN")}
                                        </p>

                                        <div className="cart-item-footer">
                                            <div className="quantity-control">
                                                <button
                                                    onClick={() =>
                                                        handleQuantity(
                                                            product._id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    disabled={
                                                        busy ||
                                                        item.quantity <= 1
                                                    }
                                                    aria-label="Decrease quantity"
                                                >
                                                    −
                                                </button>

                                                <span>{item.quantity}</span>

                                                <button
                                                    onClick={() =>
                                                        handleQuantity(
                                                            product._id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    disabled={
                                                        busy ||
                                                        item.quantity >=
                                                            product.stock
                                                    }
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                className="cart-remove-button"
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
                                        ₹{itemTotal.toLocaleString("en-IN")}
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
                            <strong>
                                ₹{subtotal.toLocaleString("en-IN")}
                            </strong>
                        </div>

                        <div className="summary-divider"></div>

                        <p className="summary-note">
                            Taxes and delivery charges will be calculated at
                            checkout.
                        </p>

                        <button className="checkout-button" disabled>
                            Proceed to Checkout
                        </button>
                    </aside>
                </div>
            )}
        </div>
    );
};

export default Cart;
