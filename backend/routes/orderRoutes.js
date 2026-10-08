import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { createOrder, verifyPayment } from "../controllers/orderController.js";

const orderRoutes = express.Router();

orderRoutes.post("/create-payment-order", isAuthenticated, createOrder)
orderRoutes.post("//verify-payment" , isAuthenticated, verifyPayment)



export default orderRoutes