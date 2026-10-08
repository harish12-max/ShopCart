import express from "express";
import {
    createOrder,
    getOrderId,
    getOrders,
    retryPayment,
    verifyPayment
} from "../controllers/orderController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const orderRoutes = express.Router();

orderRoutes.post(
    "/create-payment-order",
    isAuthenticated,
    createOrder
);

orderRoutes.post(
    "/verify-payment",
    isAuthenticated,
    verifyPayment
);

orderRoutes.post(
    "/:orderId/retry-payment",
    isAuthenticated,
    retryPayment
);

orderRoutes.get(
    "/",
    isAuthenticated,
    getOrders
);

orderRoutes.get(
    "/:orderId",
    isAuthenticated,
    getOrderId
);

export default orderRoutes;
