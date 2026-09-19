import express from "express";
import { productregister, getAllProduct, getProductById, searchProduct } from "../controllers/productRegister.js";


const productRoutes = express.Router()

// product register
productRoutes.post("/products", productregister)
productRoutes.get("/products", getAllProduct)
productRoutes.get("/products/:id", getProductById)
productRoutes.get("/product", searchProduct)

export default productRoutes;
