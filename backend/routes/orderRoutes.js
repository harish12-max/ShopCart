import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { createOrder, getOrderId, getOrders, verifyPayment } from "../controllers/orderController.js";

const orderRoutes = express.Router();

orderRoutes.post("/create-payment-order", isAuthenticated, createOrder)
orderRoutes.post("/verify-payment" , isAuthenticated, verifyPayment)
orderRoutes.get("/" ,isAuthenticated , getOrders)
orderRoutes.get("/:orderId" , isAuthenticated , getOrderId)

export default orderRoutes
