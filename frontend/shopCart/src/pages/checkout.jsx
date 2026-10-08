import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import axiosInstance from "../AxiosCall/axios";
import "../styles/checkout.css";

const initialForm = {
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: ""
};

const money = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, loading: cartLoading } = useCart();

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const items = useMemo(
        () => cart.filter((item) => item?.product),
        [cart]
    );

    const subtotal = useMemo(
        () =>
            items.reduce(
                (sum, item) =>
                    sum +
                    Number(item.product.price || 0) *
                        Number(item.quantity || 0),
                0
            ),
        [items]
    );

    const itemCount = items.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
    );

    const change = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: ""
        }));

        setSubmitError("");
    };

    const validate = () => {
        const nextErrors = {};

        if (form.fullName.trim().length < 3) {
            nextErrors.fullName = "Enter your full name.";
        }

        if (!/^\d{10}$/.test(form.phone.trim())) {
            nextErrors.phone =
                "Enter a valid 10-digit phone number.";
        }

        if (form.addressLine1.trim().length < 10) {
            nextErrors.addressLine1 =
                "Enter your complete delivery address.";
        }

        if (!form.city.trim()) {
            nextErrors.city = "Enter your city.";
        }

        if (!form.state.trim()) {
            nextErrors.state = "Enter your state.";
        }

        if (!/^\d{6}$/.test(form.pincode.trim())) {
            nextErrors.pincode =
                "Enter a valid 6-digit pincode.";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const createPaymentOrder = async (event) => {
        event.preventDefault();

        setSubmitError("");

        if (!validate()) {
            return;
        }

        if (items.length === 0) {
            setSubmitError("Your cart is empty.");
            return;
        }

        setSubmitting(true);

        try {
            const response = await axiosInstance.post(
                "/orders/create-payment-order",
                {
                    shippingAddress: {
                        fullName: form.fullName.trim(),
                        phone: form.phone.trim(),
                        addressLine1: form.addressLine1.trim(),
                        city: form.city.trim(),
                        state: form.state.trim(),
                        pincode: form.pincode.trim()
                    }
                }
            );

            navigate("/orders", {
                state: {
                    orderCreated: true,
                    orderId: response.data.orderId
                }
            });
        } catch (error) {
            console.log(error);

            setSubmitError(
                error.response?.data?.message ||
                "Unable to create your payment order."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (cartLoading) {
        return (
            <div className="checkout-page">
                <div className="checkout-state">
                    <div className="checkout-loader"></div>

                    <h2>Preparing checkout</h2>

                    <p>Loading your cart details...</p>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="checkout-page">
                <div className="checkout-empty">
                    <div className="checkout-empty-icon">🛒</div>

                    <p className="checkout-eyebrow">
                        CHECKOUT
                    </p>

                    <h1>Your cart is empty</h1>

                    <p>
                        Add products to your cart before continuing.
                    </p>

                    <button
                        className="checkout-primary-button"
                        onClick={() => navigate("/products")}
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-header">
                <div>
                    <p className="checkout-eyebrow">
                        CHECKOUT
                    </p>

                    <h1>Complete your order</h1>

                    <p>
                        Enter your delivery details and continue
                        to payment.
                    </p>
                </div>

                <button
                    className="checkout-back-button"
                    type="button"
                    onClick={() => navigate("/cart")}
                >
                    ← Back to Cart
                </button>
            </div>

            <div className="checkout-stepper">
                <div className="checkout-step checkout-step-active">
                    <span>1</span>

                    <div>
                        <strong>Delivery</strong>

                        <small>Shipping details</small>
                    </div>
                </div>

                <div className="checkout-step-line"></div>

                <div className="checkout-step">
                    <span>2</span>

                    <div>
                        <strong>Payment</strong>

                        <small>Razorpay checkout</small>
                    </div>
                </div>
            </div>

            <form
                className="checkout-layout"
                onSubmit={createPaymentOrder}
            >
                <main className="checkout-main">
                    <section className="checkout-card">
                        <div className="checkout-section-heading">
                            <div className="checkout-section-number">
                                01
                            </div>

                            <div>
                                <h2>Delivery details</h2>

                                <p>
                                    Where should we deliver your
                                    order?
                                </p>
                            </div>
                        </div>

                        {submitError && (
                            <div className="checkout-error">
                                <span>!</span>
                                {submitError}
                            </div>
                        )}

                        <div className="checkout-form-grid">
                            <Field
                                label="Full name"
                                name="fullName"
                                value={form.fullName}
                                onChange={change}
                                error={errors.fullName}
                                placeholder="Enter your full name"
                                full
                            />

                            <Field
                                label="Phone number"
                                name="phone"
                                value={form.phone}
                                onChange={change}
                                error={errors.phone}
                                placeholder="10-digit mobile number"
                                maxLength="10"
                                full
                            />

                            <div className="checkout-field checkout-field-full">
                                <label htmlFor="addressLine1">
                                    Address
                                </label>

                                <textarea
                                    id="addressLine1"
                                    name="addressLine1"
                                    rows="4"
                                    value={form.addressLine1}
                                    onChange={change}
                                    placeholder="House / flat, street, area, landmark..."
                                    aria-invalid={Boolean(
                                        errors.addressLine1
                                    )}
                                ></textarea>

                                {errors.addressLine1 && (
                                    <small className="field-error">
                                        {errors.addressLine1}
                                    </small>
                                )}
                            </div>

                            <Field
                                label="City"
                                name="city"
                                value={form.city}
                                onChange={change}
                                error={errors.city}
                                placeholder="Your city"
                            />

                            <Field
                                label="State"
                                name="state"
                                value={form.state}
                                onChange={change}
                                error={errors.state}
                                placeholder="Your state"
                            />

                            <Field
                                label="Pincode"
                                name="pincode"
                                value={form.pincode}
                                onChange={change}
                                error={errors.pincode}
                                placeholder="6-digit pincode"
                                maxLength="6"
                            />
                        </div>
                    </section>

                    <section className="checkout-card">
                        <div className="checkout-section-heading">
                            <div className="checkout-section-number">
                                02
                            </div>

                            <div>
                                <h2>Payment</h2>

                                <p>
                                    You'll continue to Razorpay
                                    after this step.
                                </p>
                            </div>
                        </div>

                        <div className="checkout-payment-option checkout-payment-selected">
                            <div className="checkout-radio">
                                <span></span>
                            </div>

                            <div>
                                <strong>Online Payment</strong>

                                <p>
                                    Secure payment through Razorpay.
                                </p>
                            </div>

                            <span className="checkout-payment-tag">
                                Razorpay
                            </span>
                        </div>
                    </section>
                </main>

                <aside className="checkout-sidebar">
                    <section className="checkout-card checkout-review-card">
                        <div className="checkout-review-heading">
                            <div>
                                <p className="checkout-eyebrow">
                                    YOUR ORDER
                                </p>

                                <h2>Order review</h2>
                            </div>

                            <span>{itemCount} items</span>
                        </div>

                        <div className="checkout-review-items">
                            {items.map((item) => (
                                <div
                                    className="checkout-review-item"
                                    key={item.product._id}
                                >
                                    <div className="checkout-review-image">
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                        />

                                        <span>{item.quantity}</span>
                                    </div>

                                    <div className="checkout-review-details">
                                        <strong>
                                            {item.product.name}
                                        </strong>

                                        <small>
                                            {item.product.category}
                                        </small>
                                    </div>

                                    <strong className="checkout-review-price">
                                        {money(
                                            Number(
                                                item.product.price || 0
                                            ) *
                                                Number(
                                                    item.quantity || 0
                                                )
                                        )}
                                    </strong>
                                </div>
                            ))}
                        </div>

                        <div className="checkout-summary-list">
                            <div>
                                <span>Subtotal</span>

                                <strong>
                                    {money(subtotal)}
                                </strong>
                            </div>
                        </div>

                        <div className="checkout-summary-total">
                            <div>
                                <span>Total</span>

                                <strong>
                                    {money(subtotal)}
                                </strong>
                            </div>

                            <small>
                                Final payment amount is generated
                                by the server.
                            </small>
                        </div>

                        <button
                            className="checkout-primary-button checkout-place-button"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <span className="checkout-button-spinner"></span>
                                    Creating order...
                                </>
                            ) : (
                                <>
                                    Continue to Payment
                                    <span>→</span>
                                </>
                            )}
                        </button>

                        <p className="checkout-secure-note">
                            🔒 You'll be redirected to Razorpay
                            for payment.
                        </p>
                    </section>
                </aside>
            </form>
        </div>
    );
};

const Field = ({
    label,
    name,
    value,
    onChange,
    error,
    placeholder,
    maxLength,
    full
}) => {
    return (
        <div
            className={
                full
                    ? "checkout-field checkout-field-full"
                    : "checkout-field"
            }
        >
            <label htmlFor={name}>{label}</label>

            <input
                id={name}
                name={name}
                type={name === "phone" ? "tel" : "text"}
                inputMode={
                    name === "phone" || name === "pincode"
                        ? "numeric"
                        : undefined
                }
                maxLength={maxLength}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                aria-invalid={Boolean(error)}
            />

            {error && (
                <small className="field-error">
                    {error}
                </small>
            )}
        </div>
    );
};

export default Checkout;
