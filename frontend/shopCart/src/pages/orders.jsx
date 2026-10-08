import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../AxiosCall/axios";
import {
    formatDate,
    formatMoney,
    formatTime,
    getShortOrderId
} from "../utils/formatters";
import "../styles/orders.css";

const STATUS_TONES = {
    PENDING_PAYMENT: "warning",
    PLACED: "success",
    CONFIRMED: "success",
    SHIPPED: "success",
    DELIVERED: "success"
};

const STATUS_LABELS = {
    PENDING_PAYMENT: "Pending Payment",
    PLACED: "Placed",
    CONFIRMED: "Confirmed",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered"
};

const PAYMENT_TONES = {
    PAID: "success",
    FAILED: "danger",
    PENDING: "warning"
};

const PAYMENT_LABELS = {
    PAID: "Paid",
    FAILED: "Failed",
    PENDING: "Pending"
};

const ACTIVE_STATUSES = [
    "PENDING_PAYMENT",
    "PLACED",
    "CONFIRMED",
    "SHIPPED"
];

const getStatusTone = (status) => STATUS_TONES[status] || "neutral";
const getPaymentTone = (status) => PAYMENT_TONES[status] || "warning";
const getStatusLabel = (status) =>
    STATUS_LABELS[status] || status || "Unknown";
const getPaymentLabel = (status) =>
    PAYMENT_LABELS[status] || status || "Unknown";

const getItemCount = (items = []) =>
    items.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
    );

const loadRazorpay = (() => {
    let promise;

    return () => {
        if (window.Razorpay) {
            return Promise.resolve(true);
        }

        if (promise) {
            return promise;
        }

        promise = new Promise((resolve) => {
            const script = document.createElement("script");

            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;

            script.onload = () => resolve(true);

            script.onerror = () => {
                promise = null;
                resolve(false);
            };

            document.body.appendChild(script);
        });

        return promise;
    };
})();

const Orders = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (id) {
            return;
        }

        const fetchOrders = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await axiosInstance.get("/orders");
                setOrders(response.data.orders || []);
            } catch (requestError) {
                console.error("Fetch orders error:", requestError);
                setOrders([]);
                setError(
                    requestError.response?.data?.message ||
                        "Unable to load your orders right now."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [id]);

    const filteredOrders = useMemo(
        () =>
            orders.filter((order) => {
                if (filter === "Active") {
                    return ACTIVE_STATUSES.includes(order.status);
                }

                if (filter === "Completed") {
                    return order.status === "DELIVERED";
                }

                return true;
            }),
        [orders, filter]
    );

    if (id) {
        return (
            <OrderDetails
                orderId={id}
                onBack={() => navigate("/orders")}
            />
        );
    }

    if (loading) {
        return <OrdersState loading message="Loading your orders..." />;
    }

    return (
        <div className="orders-page">
            <div className="orders-header">
                <div>
                    <p className="orders-eyebrow">SHOPCART</p>
                    <h1>My Orders</h1>
                    <p>
                        Track your purchases and view complete order details.
                    </p>
                </div>

                <button
                    className="orders-secondary-button"
                    type="button"
                    onClick={() => navigate("/products")}
                >
                    Continue Shopping
                </button>
            </div>

            {location.state?.orderCreated && (
                <div className="orders-success" role="status">
                    <span>✓</span>
                    <div>
                        <strong>Payment successful</strong>
                        <p>Your order has been placed successfully.</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="orders-error" role="alert">
                    <span>!</span>
                    {error}
                </div>
            )}

            <div className="orders-toolbar">
                <div className="orders-filter-heading">
                    <strong>{orders.length}</strong>
                    <span>orders</span>
                </div>

                <div className="orders-filter-tabs">
                    {["All", "Active", "Completed"].map((name) => (
                        <button
                            key={name}
                            type="button"
                            className={filter === name ? "active" : ""}
                            onClick={() => setFilter(name)}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <OrdersEmptyState
                    hasOrders={orders.length > 0}
                    onBrowse={() => navigate("/products")}
                />
            ) : (
                <div className="orders-list">
                    {filteredOrders.map((order) => {
                        const itemCount = getItemCount(order.items);
                        const canRetryPayment =
                            order.status === "PENDING_PAYMENT" &&
                            ["PENDING", "FAILED"].includes(
                                order.paymentStatus
                            );

                        return (
                            <article
                                className="order-card"
                                key={order._id}
                            >
                                <div className="order-card-top">
                                    <div>
                                        <div className="order-card-id-row">
                                            <span className="order-card-id">
                                                {getShortOrderId(order._id)}
                                            </span>

                                            <span
                                                className={
                                                    "order-status order-status-" +
                                                    getStatusTone(order.status)
                                                }
                                            >
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </div>

                                        <p>
                                            {formatDate(order.createdAt)} ·{" "}
                                            {formatTime(order.createdAt)}
                                        </p>
                                    </div>

                                    <div className="order-card-total">
                                        <span>Total</span>
                                        <strong>
                                            {formatMoney(order.totalAmount)}
                                        </strong>
                                    </div>
                                </div>

                                <div className="order-card-items">
                                    {(order.items || [])
                                        .slice(0, 3)
                                        .map((item) => (
                                            <div
                                                className="order-mini-item"
                                                key={item.product}
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                />

                                                <div>
                                                    <strong>
                                                        {item.name}
                                                    </strong>
                                                    <span>
                                                        Qty {item.quantity}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}

                                    {order.items?.length > 3 && (
                                        <div className="order-more-items">
                                            +{order.items.length - 3} more
                                        </div>
                                    )}
                                </div>

                                <div className="order-card-bottom">
                                    <div className="order-meta">
                                        <span>{itemCount} items</span>
                                        <span>•</span>
                                        <span>
                                            Payment:{" "}
                                            {getPaymentLabel(
                                                order.paymentStatus
                                            )}
                                        </span>
                                    </div>

                                    <div className="order-card-actions">
                                        {canRetryPayment && (
                                            <RetryPaymentButton
                                                orderId={order._id}
                                                onSuccess={() => navigate(
                                                    "/orders",
                                                    {
                                                        replace: true,
                                                        state: {
                                                            orderCreated: true
                                                        }
                                                    }
                                                )}
                                            />
                                        )}

                                        <button
                                            className="orders-view-button"
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    "/orders/" +
                                                        order._id
                                                )
                                            }
                                        >
                                            View Details
                                            <span>→</span>
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const RetryPaymentButton = ({ orderId, onSuccess }) => {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleRetry = async () => {
        if (submitting) {
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            const razorpayLoaded = await loadRazorpay();

            if (!razorpayLoaded) {
                throw new Error(
                    "Unable to load Razorpay checkout. Please try again."
                );
            }

            const response = await axiosInstance.post(
                "/orders/" + orderId + "/retry-payment"
            );

            const {
                orderId: retryOrderId,
                razorpayOrderId,
                amount,
                currency,
                keyId
            } = response.data;

            if (
                !retryOrderId ||
                !razorpayOrderId ||
                !amount ||
                !currency ||
                !keyId
            ) {
                throw new Error(
                    "Payment retry details are missing."
                );
            }

            const razorpay = new window.Razorpay({
                key: keyId,
                amount,
                currency,
                name: "ShopCart",
                description: "ShopCart Order Payment",
                order_id: razorpayOrderId,
                theme: {
                    color: "#1f7a5c"
                },
                handler: async (paymentResponse) => {
                    try {
                        await axiosInstance.post(
                            "/orders/verify-payment",
                            {
                                razorpay_order_id:
                                    paymentResponse.razorpay_order_id,
                                razorpay_payment_id:
                                    paymentResponse.razorpay_payment_id,
                                razorpay_signature:
                                    paymentResponse.razorpay_signature
                            }
                        );

                        onSuccess();
                    } catch (verificationError) {
                        console.error(
                            "Retry payment verification error:",
                            verificationError
                        );

                        setError(
                            verificationError.response?.data?.message ||
                                "Payment verification failed. Check your order status."
                        );
                    } finally {
                        setSubmitting(false);
                    }
                },
                modal: {
                    ondismiss: () => {
                        setSubmitting(false);
                    }
                }
            });

            razorpay.on("payment.failed", (paymentError) => {
                console.error(
                    "Retry payment failed:",
                    paymentError
                );

                setSubmitting(false);
                setError(
                    paymentError.error?.description ||
                        "Payment failed. Please try again."
                );
            });

            razorpay.open();
        } catch (requestError) {
            console.error("Retry payment error:", requestError);

            setError(
                requestError.response?.data?.message ||
                    requestError.message ||
                    "Unable to restart payment."
            );

            setSubmitting(false);
        }
    };

    return (
        <div className="retry-payment-wrap">
            <button
                className="orders-retry-button"
                type="button"
                onClick={handleRetry}
                disabled={submitting}
            >
                {submitting ? "Opening..." : "Retry Payment"}
            </button>

            {error && (
                <span
                    className="retry-payment-error"
                    role="alert"
                >
                    {error}
                </span>
            )}
        </div>
    );
};

const OrderDetails = ({ orderId, onBack }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await axiosInstance.get(
                    "/orders/" + orderId
                );
                setOrder(response.data.order);
            } catch (requestError) {
                console.error("Fetch order error:", requestError);
                setOrder(null);
                setError(
                    requestError.response?.data?.message ||
                        "Unable to load this order."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) {
        return <OrdersState loading message="Loading order details..." />;
    }

    if (!order) {
        return (
            <OrdersState
                eyebrow="ORDER NOT FOUND"
                title="We couldn't find that order"
                message={
                    error ||
                    "The order may no longer be available."
                }
                actionLabel="Back to My Orders"
                onAction={onBack}
            />
        );
    }

    const items = order.items || [];
    const itemCount = getItemCount(items);
    const status = getStatusLabel(order.status);
    const payment = getPaymentLabel(order.paymentStatus);

    return (
        <div className="orders-page">
            <div className="orders-detail-header">
                <button
                    className="orders-back-button"
                    type="button"
                    onClick={onBack}
                >
                    ← My Orders
                </button>

                <div className="orders-detail-title">
                    <p className="orders-eyebrow">ORDER DETAILS</p>
                    <h1>{getShortOrderId(order._id)}</h1>
                    <p>
                        Order {order._id} · {formatDate(order.createdAt)} at{" "}
                        {formatTime(order.createdAt)}
                    </p>
                </div>

                <span
                    className={
                        "order-status order-status-" +
                        getStatusTone(order.status)
                    }
                >
                    {status}
                </span>
            </div>

            <div className="orders-detail-grid">
                <main className="orders-detail-main">
                    <section className="orders-detail-card">
                        <div className="orders-card-heading">
                            <div>
                                <p className="orders-eyebrow">ITEMS</p>
                                <h2>Order items</h2>
                            </div>

                            <span>{itemCount} items</span>
                        </div>

                        <div className="orders-detail-items">
                            {items.map((item) => (
                                <article
                                    className="orders-detail-item"
                                    key={item.product}
                                >
                                    <div className="orders-detail-image">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                        />
                                    </div>

                                    <div className="orders-detail-item-info">
                                        <span>Product</span>
                                        <h3>{item.name}</h3>
                                        <p>
                                            Quantity: {item.quantity} ·{" "}
                                            {formatMoney(item.price)} each
                                        </p>
                                    </div>

                                    <strong>
                                        {formatMoney(
                                            Number(item.price || 0) *
                                                Number(item.quantity || 0)
                                        )}
                                    </strong>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="orders-detail-card">
                        <div className="orders-card-heading">
                            <div>
                                <p className="orders-eyebrow">DELIVERY</p>
                                <h2>Shipping address</h2>
                            </div>
                        </div>

                        <div className="orders-address">
                            <strong>
                                {order.shippingAddress?.fullName}
                            </strong>
                            <p>
                                {order.shippingAddress?.addressLine1}
                            </p>
                            <p>
                                {order.shippingAddress?.city},{" "}
                                {order.shippingAddress?.state} -{" "}
                                {order.shippingAddress?.pincode}
                            </p>
                            <span>
                                Phone: {order.shippingAddress?.phone}
                            </span>
                        </div>
                    </section>
                </main>

                <aside className="orders-detail-sidebar">
                    <section className="orders-detail-card orders-summary-card">
                        <p className="orders-eyebrow">SUMMARY</p>
                        <h2>Payment summary</h2>

                        <div className="orders-summary-row">
                            <span>Items</span>
                            <span>{itemCount}</span>
                        </div>

                        <div className="orders-summary-row">
                            <span>Order amount</span>
                            <span>
                                {formatMoney(order.totalAmount)}
                            </span>
                        </div>

                        <div className="orders-summary-divider"></div>

                        <div className="orders-summary-total">
                            <span>Total</span>
                            <strong>
                                {formatMoney(order.totalAmount)}
                            </strong>
                        </div>

                        <div className="orders-payment-status">
                            <span>Payment</span>
                            <strong
                                className={
                                    "payment-status-" +
                                    getPaymentTone(order.paymentStatus)
                                }
                            >
                                {payment}
                            </strong>
                        </div>

                        {order.status === "PENDING_PAYMENT" &&
                            ["PENDING", "FAILED"].includes(
                                order.paymentStatus
                            ) && (
                                <div className="orders-detail-retry">
                                    <RetryPaymentButton
                                        orderId={order._id}
                                        onSuccess={() =>
                                            window.location.reload()
                                        }
                                    />
                                </div>
                            )}
                    </section>

                    <section className="orders-detail-card orders-timeline-card">
                        <p className="orders-eyebrow">STATUS</p>
                        <h2>Order progress</h2>

                        <div className="orders-timeline">
                            <Timeline
                                active
                                label="Order created"
                                note={formatDate(order.createdAt)}
                            />

                            <Timeline
                                active={ACTIVE_STATUSES.slice(1).includes(
                                    order.status
                                )}
                                label="Processing"
                                note={status}
                            />

                            <Timeline
                                active={order.status === "DELIVERED"}
                                label="Delivered"
                                note={
                                    order.status === "DELIVERED"
                                        ? "Successfully delivered"
                                        : "Awaiting delivery"
                                }
                            />
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
};

const OrdersState = ({
    loading = false,
    eyebrow = "ORDERS",
    title = "No orders found",
    message = "Your orders will appear here.",
    actionLabel,
    onAction
}) => (
    <div className="orders-page">
        <div className="orders-state">
            {loading ? (
                <div className="orders-loader"></div>
            ) : (
                <div className="orders-state-icon">∅</div>
            )}

            <p className="orders-eyebrow">{eyebrow}</p>
            <h1>{loading ? "Loading..." : title}</h1>
            <p>{message}</p>

            {actionLabel && onAction && (
                <button
                    className="orders-primary-button"
                    type="button"
                    onClick={onAction}
                >
                    {actionLabel}
                </button>
            )}
        </div>
    </div>
);

const OrdersEmptyState = ({ hasOrders, onBrowse }) => (
    <div className="orders-state">
        <div className="orders-state-icon">∅</div>
        <p className="orders-eyebrow">NO ORDERS</p>

        <h1>
            {hasOrders
                ? "No orders match this filter"
                : "You haven't placed any orders yet"}
        </h1>

        <p>
            {hasOrders
                ? "Try another order filter."
                : "Your purchases will appear here after checkout."}
        </p>

        {!hasOrders && (
            <button
                className="orders-primary-button"
                type="button"
                onClick={onBrowse}
            >
                Browse Products
            </button>
        )}
    </div>
);

const Timeline = ({ active, label, note }) => (
    <div
        className={
            active
                ? "orders-timeline-item active"
                : "orders-timeline-item"
        }
    >
        <span></span>

        <div>
            <strong>{label}</strong>
            <small>{note}</small>
        </div>
    </div>
);

export default Orders;
