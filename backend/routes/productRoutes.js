import express from "express";
import {
    productregister,
    getAllProduct,
    getProductById,
    searchProduct
} from "../controllers/productRegister.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const productRoutes = express.Router();

productRoutes.use(isAuthenticated);

productRoutes.post("/products", productregister);
productRoutes.get("/products", getAllProduct);
productRoutes.get("/products/:id", getProductById);
productRoutes.get("/product", searchProduct);

export default productRoutes;
