import Order from "../modules/ordermodel.js";
import product from "../modules/productmodel.js";
import User from "../modules/usermodel.js";
import razorpay from "../config/razorpay.js";
import mongoose from "mongoose";
import crypto from "crypto"

export const createOrder = async (req, res) => {
    try {
        const userId = req.user._id
        const { shippingAddress } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User Not Found" })
        }

        if (!shippingAddress) {
            return res.status(400).json({
                message: "Invalid shipping address"
            });
        }

        const { fullName, phone, addressLine1, city, state, pincode } = shippingAddress;
        if (!fullName?.trim() || !phone?.trim() || !addressLine1?.trim() || !city?.trim() || !state?.trim() || !pincode?.trim()) {
            return res.status(400).json({
                message: "All shipping address fields are required"
            });
        }

        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({ message: "Invalid Mobile No." })
        }

        if (!/^\d{6}$/.test(pincode)) {
            return res.status(400).json({ message: "Invalid PinCode" })
        }

        if (!user.cart || user.cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty" })
        }

        const orderItems = [];
        let totalAmount = 0;

        for (const cartItem of user.cart) {

            const productData = await product.findById(cartItem.product)
            if (!productData) {
                return res.status(400).json({ message: "Product no longer exists" });
            }

            if (productData.stock < cartItem.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${productData.name}` })
            }

            const item = {
                product: productData._id,
                name: productData.name,
                price: productData.price,
                quantity: cartItem.quantity,
                image: productData.image
            }

            orderItems.push(item);
            totalAmount = totalAmount + productData.price * cartItem.quantity;
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
            totalAmount: totalAmount
        })

        const razorpayOrder = await razorpay.orders.create({
            amount: totalAmount * 100,
            currency: "INR",
            receipt: order._id.toString()
        })

        order.razorpayOrderId = razorpayOrder.id;
        await order.save();

        return res.status(201).json({
            message: "Order created successfully",
            orderId: order._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}



export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: "Payments Details are REquired" })
        }

        const order = await Order.findOne({
            razorpayOrderId: razorpay_order_id,
            user: req.user._id
        })

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const body =
            razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");


        if (expectedSignature !== razorpay_signature) {
            order.paymentStatus = "FAILED";
            await order.save();

            return res.status(400).json({ message: "Invalid payment signature" });
        }

        order.paymentStatus = "PAID";
        order.status = "PLACED";
        order.razorpayPaymentId = razorpay_payment_id;

        await order.save();

        const user = await User.findById(req.user._id);

        if (user) {
            user.cart = [];
            await user.save();
        }

        return res.status(200).json({
            message: "Payment verified successfully",
            orderId: order._id
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" });
    }
}



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
        return res.status(500).json({ message: "Internal Server Error" })
    }
}


export const getOrderId = async (req, res) => {
    try {
        const { orderId } = req.params
        const userId = req.user._id

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
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json({ message: "Order fetched successfully", order });


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

