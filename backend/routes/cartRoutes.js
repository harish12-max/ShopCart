import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { addToCart, deleteCartItem, getCart, updatedCart } from "../controllers/cartList.js";



const cartRoutes = express.Router();

cartRoutes.post('/cart/:productId' ,isAuthenticated, addToCart)
cartRoutes.get('/cart',isAuthenticated,getCart)
cartRoutes.patch('/cart/:productId' , isAuthenticated, updatedCart)
cartRoutes.delete('/cart/:productId', isAuthenticated, deleteCartItem )



export default cartRoutes;