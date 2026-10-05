import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import {
    addToCart,
    deleteCartItem,
    getCart,
    updatedCart
} from "../controllers/cartList.js";

const cartRoutes = express.Router();

cartRoutes.post("/:productId", isAuthenticated, addToCart);
cartRoutes.get("/", isAuthenticated, getCart);
cartRoutes.patch("/:productId", isAuthenticated, updatedCart);
cartRoutes.delete("/:productId", isAuthenticated, deleteCartItem);

export default cartRoutes;
