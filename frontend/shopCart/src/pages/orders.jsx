import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../AxiosCall/axios";
import "../styles/orders.css";

const money = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (value) => {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

const formatTime = (value) => {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
    });
};

const getStatusTone = (status) => {
    switch (status) {
        case "PENDING_PAYMENT":
            return "warning";
        case "PLACED":
        case "CONFIRMED":
        case "SHIPPED":
        case "DELIVERED":
            return "success";
        default:
            return "neutral";
    }
};

const getPaymentTone = (status) => {
    switch (status) {
        case "PAID":
            return "success";
        case "FAILED":
            return "danger";
        default:
            return "warning";
    }
};

const getStatusLabel = (status) => {
    switch (status) {
        case "PENDING_PAYMENT":
            return "Pending Payment";
        case "PLACED":
            return "Placed";
        case "CONFIRMED":
            return "Confirmed";
        case "SHIPPED":
            return "Shipped";
        case "DELIVERED":
            return "Delivered";
        default:
            return status || "Unknown";
    }
};

const getPaymentLabel = (status) => {
    switch (status) {
        case "PAID":
            return "Paid";
        case "FAILED":
            return "Failed";
        case "PENDING":
            return "Pending";
        default:
            return status || "Unknown";
    }
};

const Orders = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await axiosInstance.get("/orders");
                setOrders(response.data.orders || []);
            } catch (requestError) {
                console.log(requestError);

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
    }, []);

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            if (filter === "Active") {
                return [
                    "PENDING_PAYMENT",
                    "PLACED",
                    "CONFIRMED",
                    "SHIPPED"
                ].includes(order.status);
            }

            if (filter === "Completed") {
                return order.status === "DELIVERED";
            }

            return true;
        });
    }, [orders, filter]);

    if (id) {
        return (
            <OrderDetails
                orderId={id}
                onBack={() => navigate("/orders")}
            />
        );
    }

    if (loading) {
        return (
            <div className="orders-page">
                <div className="orders-state">
                    <div className="orders-loader"></div>
                    <p>Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <div className="orders-header">
                <div>
                    <p className="orders-eyebrow">SHOPCART</p>

                    <h1>My Orders</h1>

                    <p>
                        Track your purchases and view complete order
                        details.
                    </p>
                </div>

                <button
                    className="orders-secondary-button"
                    onClick={() => navigate("/products")}
                >
                    Continue Shopping
                </button>
            </div>

            {error && (
                <div className="orders-error">
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
                            className={filter === name ? "active" : ""}
                            onClick={() => setFilter(name)}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="orders-state">
                    <div className="orders-state-icon">∅</div>

                    <p className="orders-eyebrow">NO ORDERS</p>

                    <h1>
                        {orders.length === 0
                            ? "You haven't placed any orders yet"
                            : "No orders match this filter"}
                    </h1>

                    <p>
                        {orders.length === 0
                            ? "Your completed purchases will appear here."
                            : "Try another order filter."}
                    </p>

                    {orders.length === 0 && (
                        <button
                            className="orders-primary-button"
                            onClick={() => navigate("/products")}
                        >
                            Browse Products
                        </button>
                    )}
                </div>
            ) : (
                <div className="orders-list">
                    {filteredOrders.map((order) => {
                        const itemCount = order.items.reduce(
                            (sum, item) =>
                                sum + Number(item.quantity || 0),
                            0
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
                                                {order._id}
                                            </span>

                                            <span
                                                className={`order-status order-status-${getStatusTone(
                                                    order.status
                                                )}`}
                                            >
                                                {getStatusLabel(
                                                    order.status
                                                )}
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
                                            {money(order.totalAmount)}
                                        </strong>
                                    </div>
                                </div>

                                <div className="order-card-items">
                                    {order.items
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

                                    {order.items.length > 3 && (
                                        <div className="order-more-items">
                                            +{order.items.length - 3} more
                                        </div>
                                    )}
                                </div>

                                <div className="order-card-bottom">
                                    <div className="order-meta">
                                        <span>
                                            {itemCount} items
                                        </span>

                                        <span>•</span>

                                        <span>
                                            Payment:{" "}
                                            {getPaymentLabel(
                                                order.paymentStatus
                                            )}
                                        </span>
                                    </div>

                                    <button
                                        className="orders-view-button"
                                        onClick={() =>
                                            navigate(
                                                `/orders/${order._id}`
                                            )
                                        }
                                    >
                                        View Details
                                        <span>→</span>
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
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
                    `/orders/${orderId}`
                );

                setOrder(response.data.order);
            } catch (requestError) {
                console.log(requestError);

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
        return (
            <div className="orders-page">
                <div className="orders-state">
                    <div className="orders-loader"></div>
                    <p>Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="orders-page">
                <div className="orders-state">
                    <div className="orders-state-icon">?</div>

                    <p className="orders-eyebrow">
                        ORDER NOT FOUND
                    </p>

                    <h1>We couldn't find that order</h1>

                    <p>
                        {error ||
                            "The order may no longer be available."}
                    </p>

                    <button
                        className="orders-primary-button"
                        onClick={onBack}
                    >
                        Back to My Orders
                    </button>
                </div>
            </div>
        );
    }

    const itemCount = order.items.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
    );

    const status = getStatusLabel(order.status);
    const statusTone = getStatusTone(order.status);

    const payment = getPaymentLabel(order.paymentStatus);
    const paymentTone = getPaymentTone(order.paymentStatus);

    return (
        <div className="orders-page">
            <div className="orders-detail-header">
                <button
                    className="orders-back-button"
                    onClick={onBack}
                >
                    ← My Orders
                </button>

                <div className="orders-detail-title">
                    <p className="orders-eyebrow">
                        ORDER DETAILS
                    </p>

                    <h1>{order._id}</h1>

                    <p>
                        Placed on {formatDate(order.createdAt)} at{" "}
                        {formatTime(order.createdAt)}
                    </p>
                </div>

                <span
                    className={`order-status order-status-${statusTone}`}
                >
                    {status}
                </span>
            </div>

            <div className="orders-detail-grid">
                <main className="orders-detail-main">
                    <section className="orders-detail-card">
                        <div className="orders-card-heading">
                            <div>
                                <p className="orders-eyebrow">
                                    ITEMS
                                </p>

                                <h2>Order items</h2>
                            </div>

                            <span>{itemCount} items</span>
                        </div>

                        <div className="orders-detail-items">
                            {order.items.map((item) => (
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
                                            {money(item.price)} each
                                        </p>
                                    </div>

                                    <strong>
                                        {money(
                                            Number(item.price || 0) *
                                                Number(
                                                    item.quantity || 0
                                                )
                                        )}
                                    </strong>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="orders-detail-card">
                        <div className="orders-card-heading">
                            <div>
                                <p className="orders-eyebrow">
                                    DELIVERY
                                </p>

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
                                Phone:{" "}
                                {order.shippingAddress?.phone}
                            </span>
                        </div>
                    </section>
                </main>

                <aside className="orders-detail-sidebar">
                    <section className="orders-detail-card orders-summary-card">
                        <p className="orders-eyebrow">
                            SUMMARY
                        </p>

                        <h2>Payment summary</h2>

                        <div className="orders-summary-row">
                            <span>Items</span>
                            <span>{itemCount}</span>
                        </div>

                        <div className="orders-summary-row">
                            <span>Order amount</span>
                            <span>{money(order.totalAmount)}</span>
                        </div>

                        <div className="orders-summary-divider"></div>

                        <div className="orders-summary-total">
                            <span>Total</span>

                            <strong>
                                {money(order.totalAmount)}
                            </strong>
                        </div>

                        <div className="orders-payment-status">
                            <span>Payment</span>

                            <strong
                                className={`payment-status-${paymentTone}`}
                            >
                                {payment}
                            </strong>
                        </div>
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
                                active={[
                                    "PLACED",
                                    "CONFIRMED",
                                    "SHIPPED",
                                    "DELIVERED"
                                ].includes(order.status)}
                                label="Processing"
                                note={status}
                            />

                            <Timeline
                                active={
                                    order.status === "DELIVERED"
                                }
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

const Timeline = ({ active, label, note }) => {
    return (
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
};

export default Orders;
