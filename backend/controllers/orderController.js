import Order from "../modules/ordermodel.js";
import product from "../modules/productmodel.js";
import User from "../modules/usermodel.js";
import razorpay from "../config/razorpay.js";
import mongoose from "mongoose";
import crypto from "crypto";

const createRazorpayOrder = async (order) => {
    return razorpay.orders.create({
        amount: Math.round(Number(order.totalAmount) * 100),
        currency: "INR",
        receipt: order._id.toString()
    });
};

export const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { shippingAddress } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        if (!shippingAddress) {
            return res.status(400).json({
                message: "Invalid shipping address"
            });
        }

        const {
            fullName,
            phone,
            addressLine1,
            city,
            state,
            pincode
        } = shippingAddress;

        if (
            !fullName?.trim() ||
            !phone?.trim() ||
            !addressLine1?.trim() ||
            !city?.trim() ||
            !state?.trim() ||
            !pincode?.trim()
        ) {
            return res.status(400).json({
                message: "All shipping address fields are required"
            });
        }

        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({ message: "Invalid Mobile No." });
        }

        if (!/^\d{6}$/.test(pincode)) {
            return res.status(400).json({ message: "Invalid PinCode" });
        }

        if (!user.cart || user.cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const orderItems = [];
        let totalAmount = 0;

        for (const cartItem of user.cart) {
            const productData = await product.findById(cartItem.product);

            if (!productData) {
                return res.status(400).json({
                    message: "Product no longer exists"
                });
            }

            if (productData.stock < cartItem.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${productData.name}`
                });
            }

            const item = {
                product: productData._id,
                name: productData.name,
                price: productData.price,
                quantity: cartItem.quantity,
                image: productData.image
            };

            orderItems.push(item);
            totalAmount += productData.price * cartItem.quantity;
        }

        const order = await Order.create({
            user: userId,
            items: orderItems,
            shippingAddress: {
                fullName: fullName.trim(),
                phone: phone.trim(),
                addressLine1: addressLine1.trim(),
                city: city.trim(),
                state: state.trim(),
                pincode: pincode.trim()
            },
            totalAmount
        });

        const razorpayOrder = await createRazorpayOrder(order);

        order.razorpayOrderId = razorpayOrder.id;
        await order.save();

        return res.status(201).json({
            message: "Order created successfully",
            orderId: order._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const retryPayment = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                message: "Invalid order ID"
            });
        }

        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (
            order.status !== "PENDING_PAYMENT" ||
            !["PENDING", "FAILED"].includes(order.paymentStatus)
        ) {
            return res.status(400).json({
                message: "This order cannot be paid again"
            });
        }

        if (!order.items?.length) {
            return res.status(400).json({
                message: "Order has no items"
            });
        }

        for (const item of order.items) {
            const productData = await product.findById(item.product);

            if (!productData) {
                return res.status(400).json({
                    message: `Product "${item.name}" is no longer available`
                });
            }

            if (productData.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${item.name}`
                });
            }
        }

        const razorpayOrder = await createRazorpayOrder(order);

        order.razorpayOrderId = razorpayOrder.id;
        order.paymentStatus = "PENDING";
        await order.save();

        return res.status(200).json({
            message: "Payment retry created successfully",
            orderId: order._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                message: "Payment details are required"
            });
        }

        const order = await Order.findOne({
            razorpayOrderId: razorpay_order_id,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.paymentStatus === "PAID") {
            return res.status(200).json({
                message: "Payment already verified",
                orderId: order._id
            });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            order.paymentStatus = "FAILED";
            await order.save();

            return res.status(400).json({
                message: "Invalid payment signature"
            });
        }

        const session = await mongoose.startSession();

        try {
            await session.withTransaction(async () => {
                const orderInTransaction = await Order.findOne({
                    _id: order._id,
                    user: req.user._id
                }).session(session);

                if (!orderInTransaction) {
                    throw new Error("Order not found");
                }

                if (orderInTransaction.paymentStatus === "PAID") {
                    return;
                }

                for (const item of orderInTransaction.items) {
                    const updatedProduct = await product.findOneAndUpdate(
                        {
                            _id: item.product,
                            stock: { $gte: item.quantity }
                        },
                        {
                            $inc: { stock: -item.quantity }
                        },
                        {
                            new: true,
                            session
                        }
                    );

                    if (!updatedProduct) {
                        throw new Error(
                            `Insufficient stock for ${item.name}`
                        );
                    }
                }

                orderInTransaction.paymentStatus = "PAID";
                orderInTransaction.status = "PLACED";
                orderInTransaction.razorpayPaymentId =
                    razorpay_payment_id;

                await orderInTransaction.save({ session });

                const user = await User.findById(req.user._id).session(
                    session
                );

                if (user) {
                    user.cart = [];
                    await user.save({ session });
                }
            });
        } finally {
            await session.endSession();
        }

        return res.status(200).json({
            message: "Payment verified successfully",
            orderId: order._id
        });
    } catch (error) {
        console.log(error);

        if (error.message?.startsWith("Insufficient stock")) {
            return res.status(400).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const getOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await Order.find({
            user: userId
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Orders fetched successfully",
            orders
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const getOrderId = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                message: "Invalid order ID"
            });
        }

        const order = await Order.findOne({
            _id: orderId,
            user: userId
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        return res.status(200).json({
            message: "Order fetched successfully",
            order
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
